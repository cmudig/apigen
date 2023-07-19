export function emitter(defaultFile: string = "") {
    const imports: { [key: string]: any} = {[defaultFile]: {}}, //TODO: not sure if the type is right
          lines: string[] = [];
  
    let prefix: string = '';
  
    const emit = (s?: string) => {
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
  
    emit.import = (methods: string[], file: string = defaultFile) => {
      file = file || defaultFile;
      (Array.isArray(methods) ? methods : [methods])
        .forEach(m => (imports[file] || (imports[file] = {}))[m] = 1);
      return emit;
    };

    emit.code = () => {
      const files = Object.keys(imports);
  
      const code = files.reduce((list: string[], file: string) => {
        const methods = Object.keys(imports[file]).sort().join(', ');
        list.push(`import {${methods}} from './${file}';`);
        return list;
      }, []);
  
      return code.concat('', lines).join('\n');
    }
  
    return emit;
}