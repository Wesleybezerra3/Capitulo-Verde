const { where, Op } = require("sequelize");
const booksModel = require("../model/livros");

// Obtém a lista de livros com filtros opcionais de autor e gênero
exports.getBooks = async (req, res) => {
  try {
    const { autor, genero, titulo } = req.query; // Obtém os parâmetros de consulta (query)
    let whereClause = {};
    let books;

    // Adiciona filtro de gênero, se especificado
    if (genero) {
      whereClause.genero = genero;
    }

    // Adiciona filtro de autor, se especificado
    if (autor) {
      whereClause.autor = autor;
    }

    if (titulo) {
      whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }
    // Busca os livros no banco de dados com base nos filtros
    books = await booksModel.findAll({
      where: whereClause,
    });

    // Converte os resultados em objetos simples
    booksData = books.map((book) => book.get({ plain: true }));
    return res.status(200).json(booksData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar livros!" });
  }
};

// Busca livros por título, usando uma consulta parcial
exports.searchBooks = async (req, res) => {
  try {
    const { titulo } = req.query; // Obtém o título da consulta
    let livros;

    // Se o título não for fornecido, retorna todos os livros
    if (!titulo) {
      livros = await booksModel.findAll();
      return null;
    } else {
      // Busca livros cujo título contém a string especificada
      livros = await booksModel.findAll({
        where: {
          titulo: {
            [Op.like]: `%${titulo}%`, // Filtro "contém" com wildcard (%)
          },
        },
      });
    }

    if (livros.length === 0) {
      return res.status(200).json([]);
    }

    // Converte os resultados em objetos simples
    const BookData = livros.map((livro) => livro.get({ plain: true }));

    return res.status(200).json(BookData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar livros!" });
  }
};

// Adiciona um novo livro ao banco de dados
exports.createBooks = async (req, res) => {
  try {
    const {
      titulo,
      autor,
      editora,
      ano_de_publicacao,
      genero,
      caminho_livro,
      capa,
    } = req.body; // Obtém os dados do corpo da requisição

    // Cria um novo livro no banco de dados
    const newBook = await booksModel.create({
      titulo,
      autor,
      editora,
      ano_de_publicacao,
      genero,
      caminho_livro,
      capa,
    });
    return res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao adicionar livro" });
  }
};

// exports.deleteLivro = (req, res) => {
//   const id = req.body.id;

//   livrosModel.delete(id, (err, result) => {
//     if (err) {
//       res.status(500).json({ error: "Erro ao deletar livro" });
//     }
//     if (result.affectedRows === 0) {
//       res.status(404).json({ error: "Livro não encontrado!" });
//     }

//     res.status(200).send("Livro removido com sucesso!");
//   });
// };
