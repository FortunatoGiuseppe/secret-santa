// src/app/http-client.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule]
})
export class HttpClientModuleStandalone {}
