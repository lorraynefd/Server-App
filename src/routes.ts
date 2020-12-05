import express from 'express'
import PointsController from './controllers/pointsController'
import ItemsControllers from './controllers/itemsControllers'

const routes = express.Router()
const pointsController = new PointsController()
const itemsControllers = new ItemsControllers()

routes.get('/items', itemsControllers.index)

routes.post('/points', pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export default routes
