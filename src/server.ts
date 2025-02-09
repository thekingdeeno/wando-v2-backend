import Application from './app';
import { server } from './config/env.config'

const application: any = new Application();

process
    .on('uncaughtException', err => {
        console.log(err);
        application.close();
        process.exit(1);
    })
    .on('SIGINT', ()=>{
        application.close();
        process.exit(0);
    });

application
  .listen(server.port, server.address);
    