export function error(_: any) {
    throw new Error(_);
  }
  
  export function isArray(_: any) {
    return Array.isArray(_);
  }
  
  export function isObject(_: any) {
    return _ === Object(_);
  }
  
  export function isString(_: any) {
    return typeof _ === 'string';
  }
  
  export function isInternal(_: any) {
    return isString(_) && _.startsWith('_');
  }
  
  export function hasOwnProperty(obj: any, property: any) {
    return Object.prototype.hasOwnProperty.call(obj, property);
  }
  
  export function reduce(input: any, value: any, key: any) {
    const items = Array.isArray(input)
      ? input
      : Object.keys(input);
  
    return items.reduce((api: any, item: any) => {
      const k = key ? key(item) : item;
      api[k] = value(item);
      return api;
    }, {});
  }
  
//   export function stringValue(_: any) {
//     return Array.isArray(_) ? '[' + _.map(stringValue) + ']'
//       : isObject(_) || isString(_) ?
//         // Output valid JSON and JS source strings.
//         // See http://timelessrepo.com/json-isnt-a-javascript-subset
//         JSON.stringify(_).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
//       : _;
//   }
  
  export function getProperty(name: string) {
    return `this.${name}` + (isInternal(name) ? '' : '()');
  }
  
  export function emitter(defaultFile: string) {

    interface importsType {
        [key: string] :any;
    }
    const imports: importsType = {[defaultFile]: {}},
          lines: string[] = [];
  
    let prefix = '';
  
    const emit = (s: string) => {
      lines.push(s ? (prefix + s) : '');
      return emit;
    };
  
    emit.indent = () => {
      prefix = prefix + '  ';
      return emit;
    };
  
    emit.outdent = () => {
      prefix = prefix.slice(0, prefix.length - 2);
      return emit;
    };
  
    // TODO: come back
    emit.import = (methods: string, file: string) => {
      file = file || defaultFile;
      (Array.isArray(methods) ? methods : [methods])
        .forEach(m => (imports[file] || (imports[file] = {}))[m] = 1);
      return emit;
    };
  
    emit.code = () => {
      const files = Object.keys(imports);
  
      const code = files.reduce((list, file) => {
        const methods = Object.keys(imports[file]).sort().join(', ');
        (list as string[]).push(`import {${methods}} from './${file}`);
        return list;
      }, []);
  
      return (code as string[]).concat('', lines).join('\n');
    }
  
    return emit;
  }
  
  export function article(_: string) {
    return _ && _.match(/^[aeiou]/i) ? 'an' : 'a';
  }
  
  export function capitalize(_: string) {
    let i = 0;
    const p = _[i] === '_' ? (++i, '_') : '';
    const c = _[i];
    return p + c.toUpperCase() + _.slice(++i);
  }
  
  export function uppercase(_: string) {
    return _.toUpperCase();
  }
  
  export function code(_:string) {
    return `<code>${_}</code>`;
  }
  
  export function link(_:string) {
    return `[${_}](${_})`;
  }
  