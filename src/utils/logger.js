// Variable __dirname por Package.json en formato Type: module
import { __dirname } from '../path.js';
// Incorporación de variable de entorno de ambiente a evaluar
import config from '../config.js'
// Agregado de módulo winston como logger
import { createLogger, format, transports } from "winston";
// Se agregan opciones de formateo de winston
const { combine, printf, timestamp, colorize } = format;

// Definición de niveles de loggeo a utilizar y colores
// https://github.com/winstonjs/winston#logging-levels
// Nivel predefinido y distinto al estándar: fatal
const customLevels = {
    levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
    },
    colors: {
        fatal: 'red whiteBG',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'grey',
        debug: 'white'
    }
}

// Se establece el nivel de loggeo según el ambiente definido
const envConsoleLevel = config.NODE_ENV === 'development' ? 'debug' : 'info'

// Configuración de winston
const logConfig = {

    // Por defecto, winston abandona la ejecución luego de loggear un "uncaughtException". Para que no lo haga seteamos exitOnError = false
    // https://github.com/winstonjs/winston#to-exit-or-not-to-exit
    exitOnError: false,

    levels: customLevels.levels,

    // Definición de consola y archivo
    transports: [
        new transports.File({
            filename: __dirname + '/logs/errors.log',
            level: 'error',
            // Formato definido para winston en archivo
            format: combine(
                timestamp({
                    format: 'MM-DD-YYYY HH:mm:ss',
                }),
                printf( (info) => `${info.level} | ${info.timestamp} | ${info.message}` )
            )
        }),
        new transports.Console({
            level: envConsoleLevel,
            // Formato definido para winston en consola
            format: combine(
                timestamp({
                    format: 'MM-DD-YYYY HH:mm:ss',
                }),
                colorize( {colors: customLevels.colors} ),
                printf( (info) => `${info.level} | ${info.timestamp} | ${info.message}` )
            )
        })
    ],
    exceptionHandlers: [
      new transports.File({ filename: __dirname + '/logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: __dirname + '/logs/rejections.log' })
    ]
};

export const logger = createLogger(logConfig)