import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any = null;
  fileName: string = null;
  _editorService: any = null;
  //px_alls['PanelSource'].hideEnterKey = true;

  constructor(private editorService: EditorService) {
    this.fileName = "E:\\Varigence\\Tutorials\\EConsoleApp\\EConsoleApp\\Program.cs";
  }

  ngOnInit() {
    let _this = this;

    monaco.languages.registerCompletionItemProvider('csharp', {
      triggerCharacters: ["."],
      provideCompletionItems: function (model, position) {
        console.log('registerCompletionItemProvider() being called');
        let wordAtPosition = model.getWordAtPosition(position);
        let wordToComplete = "";
        if (wordAtPosition) wordToComplete = wordAtPosition.word;

        let params = {
          "Buffer": model.getValue(),
          "FileName": _this.fileName,
          "Column": position.column,
          "Line": position.lineNumber,
          "WantDocumentationForEveryCompletionResult": true,
          "WantKind": true,
          "WantReturnType": true,
          "WordToComplete": wordToComplete,
        };

        //console.log(JSON.stringify(params));

        return _this.editorService.serverCall('/autocomplete', params).then(function (res) {
          if(!res) return;
          //console.log(res);

          let result = [];
          let completions = Object.create(null);

          for (let response of res) {
            let completion = {
              label: response.CompletionText,
              kind: monaco.languages.CompletionItemKind[response.Kind],
              documentation: response.Description,
              insertText: response.CompletionText,
              detail: response.ReturnType ? response.ReturnType + " " + response.CompletionText : response.CompletionText
            };

            let array = completions[completion.label];
            if (!array) {
              completions[completion.label] = [completion]
            }
            else {
              array.push(completion);
            }
          }

          // Per suggestion group, select on and indicate overloads
          for (let key in completions) {

            let suggestion = completions[key][0],
              overloadCount = completions[key].length - 1;

            if (overloadCount === 0) {
              // remove non overloaded items
              delete completions[key];
            }
            else {
              // indicate that there is more
              suggestion.detail = `${suggestion.detail} (+ ${overloadCount} overload(s))`;
            }

            result.push(suggestion);
          }

          return result;
        });
      }
    });

    


    monaco.languages.registerSignatureHelpProvider('csharp', {
      signatureHelpTriggerCharacters: ["("],
      provideSignatureHelp: function (model, position) {
        console.log('registerSignatureHelpProvider() being called');
        let params = {
          "Buffer": model.getValue(),
          "FileName": _this.fileName,
          "Column": position.column,
          "Line": position.lineNumber
        };

        //console.log(JSON.stringify(params));

        return _this.editorService.serverCall('/signaturehelp', params).then(function (res) {
          if(!res) return;
          //console.log(res);

          let signatureHelp = {
            signatures: new Array(res.Signatures.length),
            activeSignature: res.ActiveSignature,
            activeParameter: res.ActiveParameter
          };

          //TODO: Refactor (case sensitivity?)
          for (let i = 0; i < res.Signatures.length; i++) {
            let signature = res.Signatures[i];
            //console.log(signature.Documentation);

            signatureHelp.signatures[i] = {
              label: signature.Label,
              documentation: _this.extractSummaryTest(signature.Documentation), //extractSummaryText(signature.Documentation),
              parameters: new Array(signature.Parameters.length)
            };

            for (let j = 0; j < signature.Parameters.length; j++) {
              signatureHelp.signatures[i].parameters[j] = {
                label: signature.Parameters[j].Label,
                documentation: signature.Parameters[j].Documentation
              };
            };
          }

          return signatureHelp;
        })
      }
    });


    monaco.languages.registerHoverProvider('csharp', {
      provideHover: function (model, position) {
        console.log('registerSignatureHelpProvider() is being called');

        let params = {
          "Buffer": model.getValue(),
          "FileName": _this.fileName,
          "Column": position.column,
          "Line": position.lineNumber,
          "IncludeDocumentation": true,
        };

        //console.log(JSON.stringify(params));


        return _this.editorService.serverCall('/typelookup', params).then(function (res) {
          
          //console.log(res);
          
          return {
            range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
            contents: [
              res.Documentation,
              { language: 'cscript', value: res.Type }
            ]
          }
        });

      }
    });




    var csharpCode = [
      '// A Hello World! program in C#.',
      'using System;',
      'namespace HelloWorld',
      '{',
      '    class Hello',
      '    {',
      '        static void Main()',
      '        {',
      '            Console.WriteLine("Hello World!");',
      '',
      '            // Keep the console window open in debug mode.',
      '            Console.WriteLine("Press any key to exit.");',
      '            Console.ReadKey();',
      '        }',
      '    }',
      '}'
    ].join('\n');



    this.editor = monaco.editor.create(document.getElementById("container"), {
      value: csharpCode,
      language: "csharp"
    });
  }
  
  extractSummaryTest(document) {
    const summaryStartTag = '<summary>';
    const summaryEndTag = '</summary>';

    if (!document) {
      return document;
    }

    let summary = document;

    let startIndex = summary.search(summaryStartTag);
    if (startIndex < 0) {
      return "";
    }

    summary = summary.slice(startIndex + '<summary>'.length);

    let endIndex = summary.search(summaryEndTag);
    if (endIndex < 0) {
      return summary;
    }

    return summary.slice(0, endIndex).replace(/[\n\r]/g, ' ');

  }
}
