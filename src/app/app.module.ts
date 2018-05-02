import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//import { MonacoEditorLoaderModule, MonacoEditorLoaderService } from 'monaco-editor-loader';
import { MonacoEditorLoaderModule, MonacoEditorLoaderService} from '@julceswhat/angular5-monaco-editor-loader';
import {
  BaseLanguageClient,
  CloseAction,
  ErrorAction,
  createMonacoServices,
  createConnection
} from 'monaco-languageclient';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { EditorService } from './editor/services/editor.service';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MonacoEditorLoaderModule
  ],
  providers: [
    MonacoEditorLoaderService,
    EditorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
