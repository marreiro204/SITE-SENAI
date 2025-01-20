
// Importando os módulos necessários
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Cria uma instância do servidor Express
const app = express();

// Define a porta para o servidor
const port = 3000;

// Configuração de conexão com o banco de dados SQL Server
const dbConfig = {
    user: 'vitoriano',         // Nome do usuário do banco de dados
    password: '2004',          // Senha do usuário do banco de dados
    server: 'localhost',       // Endereço do servidor (localhost neste caso)
    database: 'EstágioDB',     // Nome do banco de dados
    options: {
        encrypt: true,         // Encriptação da conexão (recomendado para produção)
        trustServerCertificate: true // Confia no certificado do servidor
    }
};

// Middleware
app.use(cors());  // Habilita CORS para permitir requisições de outras origens
app.use(bodyParser.json());  // Para interpretar dados JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para dados codificados em URL (formulários)
// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota POST para cadastrar uma empresa
app.post('/cadastrar-empresa', async (req, res) => {
    const { nome, cnpj, endereco, nome_fantasia, setor_empresa, regiao_empresa, vagas_empresa } = req.body;

    try {
        // Conectando ao banco de dados
        const pool = await sql.connect(dbConfig);

        // Executa a consulta SQL para inserir os dados
        await pool.request()
            .input('Nome_Empresa', sql.NVarChar, nome)
            .input('CNPJ', sql.NVarChar, cnpj)
            .input('Endereço_Empresa', sql.NVarChar, endereco)
            .input('Nome_Fantasia', sql.NVarChar, nome_fantasia)
            .input('Setor_Empresa', sql.NVarChar, setor_empresa)
            .input('Região_Empresa', sql.NVarChar, regiao_empresa)
            .input('Qtd_Vagas', sql.NVarChar, vagas_empresa)
            .query('INSERT INTO Empresa (Nome_Empresa, CNPJ, Endereço_Empresa, Nome_Fantasia, Setor_Empresa, Região_Empresa, Qtd_Vagas ) VALUES (@Nome_Empresa, @CNPJ, @Endereço_Empresa, @Nome_Fantasia,@Setor_Empresa, @Região_Empresa, @Qtd_Vagas )');

        // Envia resposta de sucesso
        res.status(200).json({ message: 'Empresa cadastrada com sucesso!' });
    } catch (err) {
        console.error('Erro ao cadastrar empresa:', err);
        res.status(500).json({ message: 'Erro ao cadastrar empresa. Tente novamente.' });
    }
});

app.post('/cadastrar-vaga', async (req, res) => {
    const {
        nome,
        nome_vaga,
        descricao_vaga,
        tipo_vaga,
        requisitos_vaga, // Original do req.body
        endereco_vaga,
        regiao_vaga,
        bolsa_vaga,
        beneficios_Vaga,
        carga_horaria,
        contrato,
        data_conclusao,
        flex_vaga,
        vaga_pcd,
        desc_benef_vaga
    } = req.body;

    try {
        const pool = await sql.connect(dbConfig);

        // Busca o ID da empresa
        const result = await pool.request()
            .input('Nome_Empresa', sql.NVarChar, nome)
            .query('SELECT id_empresa FROM Empresa WHERE Nome_Empresa = @Nome_Empresa');

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Empresa não encontrada.' });
        }

        const empresaId = result.recordset[0].id_empresa;

        // Conversões de campos booleanos
        const vagaPcd = vaga_pcd?.toLowerCase() === 'sim' ? 1 : 0;
        const flexibilidade_vaga = flex_vaga?.toLowerCase() === 'sim' ? 1 : 0;
        const beneficios_vaga = beneficios_Vaga?.toLowerCase() === 'sim' ? 1 : 0;
        const requisitos = requisitos_vaga?.toLowerCase() === 'sim' ? 1 : 0;
        const bolsaVagaNumerica = parseFloat(bolsa_vaga.replace(/[^\d.-]/g, ''));
        const descBenefVaga = desc_benef_vaga?.trim() || null;
     


        // Inserção no banco de dados
        await pool.request()
            .input('id_empresa', sql.Int, empresaId)
            .input('Nome_Vaga', sql.NVarChar, nome_vaga)
            .input('Descricao', sql.NVarChar, descricao_vaga)
            .input('Tipo', sql.NVarChar, tipo_vaga)
            .input('Requisitos', sql.Bit, requisitos) // Variável renomeada
            .input('Endereco_Vaga', sql.NVarChar, endereco_vaga)
            .input('Regiao', sql.NVarChar, regiao_vaga)
            .input('Bolsa_Vaga', sql.Decimal(10, 2), bolsaVagaNumerica)
            .input('Benef_Vaga', sql.Bit, beneficios_vaga)
            .input('Desc_Benef_Vaga', descBenefVaga)
            .input('Carga_Horaria', sql.NVarChar, carga_horaria)
            .input('Periodo_contrato', sql.NVarChar, contrato)
            .input('Ano_Conclusao_Curso', sql.Date, data_conclusao)
            .input('Flex_Horario', sql.Bit, flexibilidade_vaga)
            .input('PCD', sql.Bit, vagaPcd)
            .query(
                `INSERT INTO Vagas 
                (id_empresa, Nome_Vaga, Descricao, Tipo, Requisitos, Endereco_Vaga, Regiao, Bolsa_Vaga, Benef_Vaga, 
                Desc_Benef_Vaga, Carga_Horaria, Periodo_contrato, Ano_Conclusao_Curso, Flex_Horario, PCD) 
                VALUES 
                (@id_empresa, @Nome_Vaga, @Descricao, @Tipo, @Requisitos, @Endereco_Vaga, @Regiao, @Bolsa_Vaga, 
                @Benef_Vaga, @Desc_Benef_Vaga, @Carga_Horaria, @Periodo_contrato, @Ano_Conclusao_Curso, @Flex_Horario, @PCD)`
            );

        res.status(200).json({ message: 'Vaga cadastrada com sucesso!' });
    } catch (err) {
        console.error('Erro ao cadastrar vaga:', err);
        res.status(500).json({ message: 'Erro ao cadastrar vaga. Tente novamente.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
