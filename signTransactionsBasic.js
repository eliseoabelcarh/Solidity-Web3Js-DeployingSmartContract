/*
PRIMEROS PASOS EN TERMINAL:
npm install web3
npm i ethereumjs-tx
verificar documentación de métodos porque pueden cambiar según las versiones
*/


//declaro require clases
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

//nodoUrl Ropsten - conectarse a un nodo, en este caso de INFURA
const nodoUrl = 'https://ropsten.infura.io/v3/46d519649fc64213a39231ab0f13d6b8';
const web3 = new Web3(nodoUrl);

//claves públicas y privadas
const address1 = process.env.ADDRESS1
const address2 = process.env.ADDRESS2
const address1Key = new Buffer.from(process.env.ADDRESS1_KEY, 'hex');
const address2Key = new Buffer.from(process.env.ADDRESS2_KEY, 'hex');

//obtengo balance de address1

//
web3.eth.getTransactionCount(address1, (error, txCount) => {

    //creamos una transacción
    let rawTx = {
        nonce: web3.utils.toHex(txCount),
        gasPrice: web3.utils.toHex(web3.utils.toWei('8', 'gwei')),
        gasLimit: web3.utils.toHex(21000),
        to: address2,
        value: web3.utils.toHex(web3.utils.toWei('0.03', 'ether')),
        //no enviamos data
        //data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
    }

    //empaquetamos la transacción y la firmamos
    const tx = new EthereumTx(rawTx, { 'chain': 'ropsten' });
    tx.sign(address1Key);

    //serializamos la transacción firmada en forma de string hexadec
    let serializedTx = tx.serialize();

    //enviamos la transacción firmada y serializada
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log)


});

