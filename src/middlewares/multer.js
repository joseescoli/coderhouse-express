import multer from 'multer';
import { __dirname } from '../path.js';
import { mkdirSync } from 'fs'


const storage = multer.diskStorage({
    // Carpeta de destino
    destination: function (req, files, cb) {
        let folder = __dirname + '/data/'
        const docType = req.body.doctype
        const user = req.params.uid
        switch (docType) {
            case 'ID':
                folder += `documents/${user}`
                break;
            case 'Address':
                folder += `documents/${user}`
                break;
            case 'Accounting':
                folder += `documents/${user}`
                break;
            case 'Profile':
                folder += `images/profiles/${user}`
                break;
            case 'Product':
                folder += `images/products/${user}`
                break;
            default:
                break;
        }
        mkdirSync(folder, { recursive: true })
        cb(null, folder)
    },

    // Nombre de archivo final
    filename: function (req, files, cb) {
    cb(null, files.originalname)
    }
  })
  
export const uploader = multer({ storage: storage })