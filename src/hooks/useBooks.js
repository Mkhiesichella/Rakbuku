import { useState, useEffect, useCallback } from 'react'
import { bookService } from '../services/bookService'

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [source, setSource] = useState('local')

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await bookService.list()
      setBooks(res.data)
      setSource(res.source)
    } catch (err) {
      setError(err.message || 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const addBook = async (d) => {
    await bookService.create(d)
    await refetch()
  }
  const updateBook = async (id, d) => {
    await bookService.update(id, d)
    await refetch()
  }
  const deleteBook = async (id) => {
    await bookService.remove(id)
    await refetch()
  }

  return { books, loading, error, source, refetch, addBook, updateBook, deleteBook }
}
