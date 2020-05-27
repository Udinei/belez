import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';
import { resolve } from 'path'; // usado para indicar endereço de diretorios
import exphbs from 'express-handlebars'; // uso de templates
import nodemailerhbs from 'nodemailer-express-handlebars'; // uso de templates de email

class Mail {
  constructor(){
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
       host,
       port,
       secure,
       auth: auth.user ? auth : null, // se não tiver autenticação no servidor de email passa null
    });

    this.configureTemplates();
  }

  // configurando os templates de email
  configureTemplates(){
    // criando path dos templates
    const viewPath = resolve(__dirname, '..', 'app','views', 'emails');

      // informando endereços de localizacao das templates na app e extensoes, para compilacao
      this.transporter.use(
        'compile',
        nodemailerhbs({
          viewEngine: exphbs.create({
            layoutsDir: resolve(viewPath, 'layouts'),
            partialsDir: resolve(viewPath, 'partials'),
            defaultLayout: 'default',
            extname: '.hbs'
          }),
          viewPath,
          extName: '.hbs',
        })
      );
  }

    sendMail(message){
      return this.transporter.sendMail({
          ... mailConfig.default,// ... (adiciona tudo que tiver dentro de mailConfig.default
          ... message,           //  no corpa da funcao  transporter)
      })
    }
  }

  export default new Mail();
