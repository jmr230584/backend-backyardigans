import { server } from './server';
import { DatabaseModel } from './model/DatabaseModel';

const port: number = 3333;

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Aplicação on-line em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})