const knex = require('../database/knex')

class NotesController {
  async create(request, response) {
    const { title, description, tags = [], links = [] } = request.body // Valores padrão
    const { user_id } = request.params

    const [note_id] = await knex('notes').insert({
      title,
      description,
      user_id,
    })

    if (Array.isArray(links) && links.length > 0) {
      const linksInsert = links.map(link => ({
        note_id,
        url: link,
      }))
      await knex('links').insert(linksInsert)
    }

    if (Array.isArray(tags) && tags.length > 0) {
      const existingTags = await knex('tags')
        .whereIn('name', tags)
        .andWhere({ user_id })
        .select('name')

      const existingTagNames = existingTags.map(tag => tag.name)

      const newTags = tags.filter(tag => !existingTagNames.includes(tag))

      if (newTags.length > 0) {
        const tagsInsert = newTags.map(name => ({
          note_id,
          name,
          user_id,
        }))

        await knex('tags').insert(tagsInsert)
        console.log('Novas tags inseridas:', tagsInsert)
      } else {
        console.log('Nenhuma nova tag para inserir.')
      }
    }

    return response.status(201).json({ message: 'Nota criada com sucesso!' })
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex('notes').where({ id }).first()
    const tags = await knex('tags').where({ note_id: id }).orderBy('name')
    const links = await knex('links')
      .where({ note_id: id })
      .orderBy('created_at')

    return response.json({
      ...note,
      tags,
      links,
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('notes').where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, user_id } = request.query

    const notes = await knex('notes')
      .where({ user_id })
      .whereLike('title', `%${title}%`)
      .orderBy('title')

    return response.json(notes)
  }
}

module.exports = NotesController
