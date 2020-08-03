const mongoose = require('mongoose');
const aws = require('aws-sdk'); // usado no delete do file, em vez do multer que é usado para upload de imagem e nao delete
const fs = require('fs');  // lib node para lidar com arquivos do sistema  read, create, delete etc.. usa programacao asyncrona
const path = require('path'); // lib node para lidar com path
const { promisify } = require('util'); // converte funcao antiga para a nova, que permite usar async await etc..

const s3 = new aws.S3(); // instancia o s3, le automaticamente as var. de ambiente no file .env

// Filex colection que mantem dados do arquivo de imagem
const FilexSchema = new mongoose.Schema({
    name: String, // nome original da imagem
    size: Number, // tamanho
    key: String,  // nome alterado da imagem
    url: String, // path da imagem na amazon S3
    createdAt: {   // data de criacao do registro
        type: Date,
        default: Date.now,
    },
});

// funcionalidade de middware do mongoose que intercepta uma
// requisicao antes de salvar um Filex no BD
FilexSchema.pre('save', function () {
    console.log(`${process.env.APP_URL}/files/${this.key}`)
    // url vazia indica que o sistema esta operando localmente,
    if (!this.url) {
          // então preenche url com o endereco local
         this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

FilexSchema.pre('remove', function () {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: process.env.BUCKET_S3,
            Key: this.key,
        }).promise() //aguardo o retorno acima
    } else {
        // unlink - deletar arquivo
        return promisify(fs.unlink)( //retorna uma nova funcao com promisse
            path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
      );
    }
});

// Filex são as informações da imagem a serem gravadas no BD
module.exports = mongoose.model("Filex", FilexSchema)
