import { CommonEngine } from '@angular/ssr/node';
import { render } from '@netlify/angular-runtime/common-engine.mjs';
import bootstrap from './main.server';

// Initialize the CommonEngine with the bootstrap function 
// (passing bootstrap is sometimes required depending on your exact minor version of Angular, so it's safer to include it)
const commonEngine = new CommonEngine({ bootstrap });

export async function netlifyCommonEngineHandler(request: Request, context: any): Promise<Response> {
  // Example API endpoints can be defined here.
  // const pathname = new URL(request.url).pathname;
  // if (pathname === '/api/hello') {
  //   return Response.json({ message: 'Hello from the API' });
  // }

  return await render(commonEngine);
}
