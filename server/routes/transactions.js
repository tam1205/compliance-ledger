import { Router } from 'express'
import {
  getAllTransactions,
  createTransaction,
  updateTransactionStatus
} from '../controllers/transactionsController.js'

const router = Router()

router.get('/', getAllTransactions)
router.post('/', createTransaction)
router.patch('/:id/status', updateTransactionStatus)

export default router
