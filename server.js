const app = require('./app.js');
const os = require('os');

const PORT = 9191;



app.listen(PORT, () => {
    const networkInterfaces = os.networkInterfaces();
    let ip = '';
    for (let interface in networkInterfaces) {
        for (let networkDetail of networkInterfaces[interface]) {
            if (networkDetail.family === 'IPv4' && !networkDetail.internal) {
                ip = networkDetail.address;
                break;
            }
        }
        if (ip !== '') break;
    }

    console.log(`Servidor rodando no endereço: http://${ip}:${PORT}`)
    console.log(`Para acessar o widget, acesse: http://${ip}:${PORT}/component/card/card.js`)
})