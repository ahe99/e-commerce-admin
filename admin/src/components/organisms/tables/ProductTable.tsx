import dayjs from 'dayjs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'

import { Product } from '@/utils/ProductData'
import { usePagination, useSort } from '@/hooks'

import { Paper } from '@/components/atoms'

import CSS from './ProducsTable.module.css'

interface ProductTableProps {
  products: Product[]
  onClickItem?: (productId: Product['objectId']) => void
}
interface HeadCell {
  id: keyof Product
  label: string
  disablePadding: boolean
  sortable: boolean
  numeric: boolean
}

const headCells: HeadCell[] = [
  {
    id: 'image',
    sortable: false,
    numeric: false,
    disablePadding: false,
    label: 'Preview',
  },
  {
    id: 'name',
    sortable: true,
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'category_name',
    sortable: true,
    numeric: false,
    disablePadding: false,
    label: 'Caterory',
  },
  {
    id: 'price',
    sortable: true,
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'stock_quantity',
    sortable: true,
    numeric: true,
    disablePadding: true,
    label: 'Stock Quantity',
  },
  {
    id: 'createdAt',
    sortable: true,
    numeric: true,
    disablePadding: false,
    label: 'Create Date',
  },
  {
    id: 'updatedAt',
    sortable: true,
    numeric: true,
    disablePadding: false,
    label: 'Last update',
  },
]

export const ProductTable = ({
  products,
  onClickItem = () => {},
}: ProductTableProps) => {
  const { updatePagination, currnetPage, rowsPerPage } = usePagination(10)
  const { orderBy, order, sortFn, updateSort } = useSort<Product>('createdAt')

  const sortedProducts = sortFn(products)
  const paginatedProducts = sortedProducts.filter(
    (_, index) =>
      index >= rowsPerPage * currnetPage &&
      index < rowsPerPage * (currnetPage + 1),
  )
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="produdcts-table">
        <TableHead>
          <TableRow>
            {headCells.map(
              ({ label, id, numeric, disablePadding, sortable }) => (
                <TableCell
                  key={id}
                  align={numeric ? 'right' : 'left'}
                  padding={disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === id ? order : false}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === id}
                      direction={orderBy === id ? order : 'asc'}
                      onClick={() => updateSort(id)}
                    >
                      <span className={CSS.table_head_text}>{label}</span>
                      {orderBy === id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    <span className={CSS.table_head_text}>{label}</span>
                  )}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedProducts.map(
            ({
              objectId,
              name,
              price,
              stock_quantity,
              category_name,
              createdAt,
              updatedAt,
              image,
            }) => (
              <TableRow
                key={objectId}
                sx={{
                  'cursor': 'pointer',
                  '&:hover': { opacity: 0.4 },
                }}
                hover={true}
                onClick={() => onClickItem(objectId)}
              >
                <TableCell component="th" scope="row">
                  <img
                    className={CSS.product_image}
                    src={image.src}
                    alt={name}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell>{category_name}</TableCell>
                <TableCell align="right">{`$${price}`}</TableCell>
                <TableCell align="right">{stock_quantity}</TableCell>
                <TableCell align="right">
                  {dayjs(createdAt).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell align="right">
                  {dayjs(updatedAt).format('YYYY-MM-DD')}
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={currnetPage}
        onPageChange={(_, newPage) => updatePagination.currnetPage(newPage)}
        onRowsPerPageChange={(e) =>
          updatePagination.rowsPerPage(Number(e.target.value))
        }
      />
    </TableContainer>
  )
}
