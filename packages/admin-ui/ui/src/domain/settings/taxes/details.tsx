import clsx from "clsx"
import { useAdminRegion, useAdminTaxRates } from "medusa-react"
import { useEffect, useState } from "react"
import { useTable } from "react-table"
import Spinner from "../../../components/atoms/spinner"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import { PaginationProps, TaxRateType } from "../../../types/shared"
import EditTaxRate from "./edit"
import NewTaxRate from "./new"
import { RegionTaxForm } from "./region-form"
import { TaxRateRow } from "./tax-rate-row"
import useTaxRateColumns from "./use-tax-rate-columns"

export type TaxRateTableEntries = {
  id: string
  name?: string
  rate: number | null
  code: string | null
  type: TaxRateType
}

const DEFAULT_PAGESIZE = 10

const TaxDetails = ({ id }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    limit: DEFAULT_PAGESIZE,
    offset: 0,
  })
  const [showNew, setShowNew] = useState<boolean>(false)
  const [editRate, setEditRate] = useState<TaxRateTableEntries | null>(null)
  const [tableEntries, setTableEntries] = useState<TaxRateTableEntries[]>([])

  const { tax_rates, isLoading: taxRatesLoading } = useAdminTaxRates(
    {
      region_id: id,
      ...pagination,
    },
    {
      enabled: !!id,
    }
  )

  const { region, isLoading: regionIsLoading } = useAdminRegion(id, {
    enabled: !!id,
  })

  useEffect(() => {
    if (!taxRatesLoading && !regionIsLoading && region && tax_rates) {
      const regionDefaultRate = {
        id: region.id,
        name: "Default",
        code: region.tax_code ?? null,
        rate: region.tax_rate ?? null,
        type: TaxRateType.REGION,
      }

      setTableEntries([
        regionDefaultRate,
        ...tax_rates.map((tr) => {
          return {
            id: tr.id,
            name: tr.name,
            code: tr.code,
            rate: tr.rate,
            type: TaxRateType.RATE,
          }
        }),
      ])
    }
  }, [taxRatesLoading, regionIsLoading, region, tax_rates])

  const [columns] = useTaxRateColumns()

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: tableEntries || [],
      manualPagination: true,
      autoResetPage: false,
    })

  if (!id) {
    return null
  }

  return (
    <>
      <BodyCard
        title="Details"
        actionables={[
          {
            label: "New Tax Rate",
            onClick: () => setShowNew(true),
            icon: <PlusIcon />,
          },
        ]}
      >
        <Table
          {...getTableProps()}
          className={clsx({ ["relative"]: regionIsLoading })}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          {regionIsLoading || taxRatesLoading ? (
            <div className="absolute mt-10 flex h-full w-full items-center justify-center">
              <div className="">
                <Spinner size={"large"} variant={"secondary"} />
              </div>
            </div>
          ) : (
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <TaxRateRow
                    key={row.original.id}
                    onEdit={setEditRate}
                    row={row}
                  />
                )
              })}
            </Table.Body>
          )}
        </Table>
        <h3 className="inter-large-semibold mt-2xlarge mb-base">
          Tax Calculation Settings
        </h3>
        <div className="flex flex-1">
          {!regionIsLoading && region && <RegionTaxForm region={region} />}
        </div>
      </BodyCard>
      {showNew && (
        <NewTaxRate regionId={id} onDismiss={() => setShowNew(false)} />
      )}
      {editRate && (
        <EditTaxRate
          regionId={id}
          taxRate={editRate}
          taxRateId={editRate.id}
          onDismiss={() => setEditRate(null)}
        />
      )}
    </>
  )
}

export default TaxDetails
