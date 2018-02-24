import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editor: any = null;
  _editorService: any = null;
  //px_alls['PanelSource'].hideEnterKey = true;

  constructor(private editorService: EditorService) { }

  ngOnInit() {
    let _this = this;

    // monaco.languages.registerCompletionItemProvider('csharp', {
    //   triggerCharacters: ["."],
    //   provideCompletionItems: function (model, position) {
    //     console.log('registerCompletionItemProvider() being called');
    //     let wordAtPosition = model.getWordAtPosition(position);
    //     let wordToComplete = "";
    //     if (wordAtPosition) wordToComplete = wordAtPosition.word;

    //     let params = {
    //       "Buffer": model.getValue(),
    //       "FileName": "fileName.cs",
    //       "Column": position.column,
    //       "Line": position.lineNumber,
    //       "WantDocumentationForEveryCompletionResult": true,
    //       "WantKind": true,
    //       "WantReturnType": true,
    //       "WordToComplete": wordToComplete,
    //     };

    //     return _this.httpRequest("", params).then(function (res) {
    //       console.log('Want to know if I am being called.');
    //       console.log(res);

    //       return [];
    //     });


    //     //console.log('end :(')
    //     //return [];
    //   }
    // });


    // monaco.languages.registerSignatureHelpProvider('csharp', {
    //   signatureHelpTriggerCharacters: ["("],
    //   provideSignatureHelp: function (model, position) {
    //     console.log('registerSignatureHelpProvider() being called');
    //     let params = {
    //       "Buffer": model.getValue(),
    //       "FileName": "fileName.cs",
    //       "Column": position.column,
    //       "Line": position.lineNumber
    //     };

    //     return _this.httpRequest("", params).then(function (res) {

    //       return [];
    //     })
    //   }
    // });


    monaco.languages.registerHoverProvider('csharp', {
      provideHover: function (model, position) {
        console.log('registerSignatureHelpProvider() is being called');

        let params = {
          "Buffer": model.getValue(),
          "FileName": "ExampleCode.cs",
          "Column": position.column,
          "Line": position.lineNumber,
          "IncludeDocumentation": true,
        };

        console.log(JSON.stringify(params));


        return _this.editorService.serverCall('/typelookup', params).then(function (res) {
          
          console.log(res);
          
          return {
            range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
            contents: [
              
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


  //Makes angular request into monaco requests
  // httpRequest(url: string, params: any): any {
  //   console.log("httpRequest() is being called");

  //   let _this = this;
  //   let capi = null;
  //   let promise = new monaco.Promise(function (c, e, p) {

  //     _this.editorService.serverCall(url, params).subscribe(res => res);

  //   })

  //   return promise;
  // }
}
