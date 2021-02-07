/** @typedef {import('@babel/core').NodePath<import('@babel/types').CallExpression>} CallExpression */

/** @typedef {import('@babel/types').Node} NodeName */

/**
 * @param {typeof import('@babel/core')} babel
 * @returns {import('@babel/core').PluginObj}
 */
module.exports = function kytRuntimeBabel({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (source !== 'kyt-runtime/dynamic') return;

        const defaultSpecifier = path.get('specifiers').find(specifier => {
          return specifier.isImportDefaultSpecifier();
        });

        if (!defaultSpecifier) return;

        const bindingName = defaultSpecifier.node.local.name;
        const binding = path.scope.getBinding(bindingName);

        if (!binding) {
          return;
        }

        binding.referencePaths.forEach(refPath => {
          let callExpression = refPath.parentPath;

          if (callExpression.isMemberExpression() && callExpression.node.computed === false) {
            const property = callExpression.get('property');
            if (!Array.isArray(property) && property.isIdentifier({ name: 'Map' })) {
              callExpression = callExpression.parentPath;
            }
          }

          if (!callExpression.isCallExpression()) return;

          let args = /** @type {CallExpression} */ (callExpression).get('arguments');
          if (args.length > 2) {
            throw callExpression.buildCodeFrameError(
              'kyt-runtime/dynamic only accepts 2 arguments'
            );
          }

          if (!args[0]) {
            return;
          }

          let loader;
          let options;

          if (args[0].isObjectExpression()) {
            [options] = args;
          } else {
            if (!args[1]) {
              callExpression.node.arguments.push(t.objectExpression([]));
            }
            // This is needed as the code is modified above
            args = /** @type {CallExpression} */ (callExpression).get('arguments');
            [loader, options] = args;
          }

          if (!options || !options.isObjectExpression()) return;

          const properties = options.get('properties');

          const propertiesMap = {};

          if (!properties || !Array.isArray(properties)) return;

          properties.forEach(property => {
            const key = property.get('key');
            if ('node' in key && key.node && 'name' in key.node && key.node.name) {
              propertiesMap[key.node.name] = property;
            }
          });

          if (propertiesMap.webpack) {
            return;
          }

          if (propertiesMap.loader) {
            loader = propertiesMap.loader.get('value');
          }

          if (propertiesMap.modules) {
            loader = propertiesMap.modules.get('value');
          }

          if (!loader || Array.isArray(loader)) {
            return;
          }
          const dynamicImports = [];

          loader.traverse({
            Import(p) {
              const argmts = p.parentPath.get('arguments');
              if (!Array.isArray(argmts)) return;
              const { node } = argmts[0];
              dynamicImports.push(node);
            },
          });

          if (!dynamicImports.length) return;

          options.node.properties.push(
            t.objectProperty(
              t.identifier('loadableGenerated'),
              t.objectExpression([
                t.objectProperty(
                  t.identifier('webpack'),
                  t.arrowFunctionExpression(
                    [],
                    t.arrayExpression(
                      dynamicImports.map(dynamicImport => {
                        return t.callExpression(
                          t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')),
                          [dynamicImport]
                        );
                      })
                    )
                  )
                ),
                t.objectProperty(t.identifier('modules'), t.arrayExpression(dynamicImports)),
              ])
            )
          );
        });
      },
    },
  };
};
