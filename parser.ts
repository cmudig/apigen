import ts from "typescript";
import * as fs from 'fs';

export function parse(file: string){
    const source = fs.readFileSync(file, 'utf-8');
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    
    // Add an ID to every node in the tree to make it easier to identify in
    // the consuming application.
    let nextId = 0;
    function addId(node: any) {
      nextId++;
      node.id = nextId;
      ts.forEachChild(node, addId);
    }
    addId(sourceFile);
    
    const cache: any = [];
    const json = JSON.stringify(sourceFile, (key, value) => {
      // Discard the following.
      if (key === 'flags' || key === 'transformFlags' || key === 'modifierFlagsCache') {
        return;
      }
    
      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;
    
        cache.push(value);
      }
      return value;
    });
    
    return json;
    }