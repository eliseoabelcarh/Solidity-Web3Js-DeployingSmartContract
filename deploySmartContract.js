
//declaro require clases
const Web3 = require('web3');
const EthereumTx =  require('ethereumjs-tx').Transaction;
const solc = require('solc');
//OJO AL HACER npm install AL COMPILADOR
// TIENE Q SER MISMA VERSION A USAR EN PRAGMA 
//EN este caso usamos --- npm i solc@0.5.0
const fs = require('fs');


//nodoUrl Ropsten - conectarse a un nodo, en este caso de INFURA
const nodoUrl = "https://ropsten.infura.io/v3/46d519649fc64213a39231ab0f13d6b8";
const web3 = new Web3 (nodoUrl);


//claves públicas y privadas
const address1 = '----aca la clave publica -- -----';
const address1Key = new Buffer.from('------aca la clave privada-------','hex');

//hacer una lectura sincrónica del archivo y 
const contenido = fs.readFileSync('contratito.sol').toString();

//compilamos el archivo en un objeto definiendo inputs y outputs
const input = {
    language: 'Solidity',
    sources : {
        'contratito' : {
            content : contenido
        }
    },
    settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }

};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
//se usa ciclo for para varios contracts
const bytecodeContract = output.contracts.contratito.MiContrato.evm.bytecode.object;

web3.eth.getTransactionCount(address1 , (err, txCount)=> {
    //creamos un objeto  transacción
    const rawTx = {
        nonce: web3.utils.toHex(txCount),
        gasPrice: web3.utils.toHex(web3.utils.toWei('8', 'gwei')),
        gasLimit: web3.utils.toHex(200000),//2020/04/18 - este gas limit funcionó bien --200000--
        to: null,
        //value: no aplica,
        data: '0x' + bytecodeContract
    }

    //empaquetamos la transacción y la firmamos
    const tx = new EthereumTx(rawTx, {'chain':'ropsten'} );
    tx.sign(address1Key);
 
    //serializamos la transacción firmada en forma de string hexadec
    const serializedTx = tx.serialize();

     //enviamos la transacción firmada y serializada
     web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
         console.log("contrato subido: " + receipt.contractAddress)
     })


     //se puede ejecutar desde package.json 
     //agregando en scripts --- "start": node archivo.js
     //borrando test echo error etc et

     //-----OJOO PARA PROBAR IR A REMIX Y COPIAR CODIGO DE CONTRATO 
     // compilar y debería aparecer listo para deploy 
     // probar y listo / no se requiere guardar ni play

});
