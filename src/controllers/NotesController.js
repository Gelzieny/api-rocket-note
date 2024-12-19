const knex = require('../database/knex')

class NotesController {
  async create(request, response) {
    const { title, description, tags = [], links = [] } = request.body // Valores padrão
    const { user_id } = request.params

    // Insere a nota
    const [note_id] = await knex('notes').insert({
      title,
      description,
      user_id,
    })

    // Insere os links
    if (Array.isArray(links) && links.length > 0) {
      const linksInsert = links.map(link => ({
        note_id,
        url: link,
      }))
      await knex('links').insert(linksInsert)
    }

    // Verifica e insere tags
    if (Array.isArray(tags) && tags.length > 0) {
      // Recupera tags já existentes no banco
      const existingTags = await knex('tags')
        .whereIn('name', tags)
        .andWhere({ user_id })
        .select('name')

      const existingTagNames = existingTags.map(tag => tag.name)

      // Filtra apenas as novas tags
      const newTags = tags.filter(tag => !existingTagNames.includes(tag))

      if (newTags.length > 0) {
        const tagsInsert = newTags.map(name => ({
          note_id,
          name,
          user_id,
        }))

        await knex('tags').insert(tagsInsert)
        console.log('Novas tags inseridas:', tagsInsert) // Log de confirmação
      } else {
        console.log('Nenhuma nova tag para inserir.') // Log para tags já existentes
      }
    }

    return response.status(201).json({ message: 'Nota criada com sucesso!' })
  }
}

module.exports = NotesController
