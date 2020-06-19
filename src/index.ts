import restify from 'restify';
import { run } from './schedule';


const server = restify.createServer();

server.listen(8080, function() {  
  const job = run();
  
  console.log('start 8080');
});
