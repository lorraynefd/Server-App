import Knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await Knex('points')
      .join('points_items', 'points.id', '=', 'points_items.points_id')
      .whereIn('points_items.items_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')
    return response.json(points)
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await Knex('points').where('id', id).first()
    if (!point) {
      return response.status(400).json({ message: 'Point not found' })
    }
    const items = await Knex('items')
      .join('points_items', 'items.id', '=', 'points_items.items_id')
      .where('points_items.points_id', id)
      .select('items.title')
    return response.json({ point, items })
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
      items
    } = request.body

    const trx = await Knex.transaction();
    const point =
    {
      image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf
    }
    const insertedIds = await trx('points').insert(point)
    const points_id = insertedIds[0]
    const pointItems = items.map((items_id: number) => {
      return {
        items_id,
        points_id
      }
    })
    await trx('points_items').insert(pointItems)
    await trx.commit()
    return response.json({
      id: points_id,
      ...point,
    })
  }
}
export default PointsController;