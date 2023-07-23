import { useState, useEffect, useMemo } from 'react'
import {AgGridReact} from 'ag-grid-react'
import './App.css'

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'


function App() {
  const [rowData, setRowData] = useState();

  const numberOrPriceFormatter = (data) => {
    let options = (data.colDef.field.includes('rice') ? {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 8} : { maximumSignificantDigits: 8 })
   
    return Intl.NumberFormat("en-US", options).format(data.value);
  }

  const percentFormatter = (data) => {
    return data.value + '%';
  }

  const dateFormatter = (data) => {
    return data.value ? (new Date(data.value)).toLocaleDateString() : '';
  }

  const cellColorStyle = (data) => {
    return (data.value > 0 && { color: 'green' }) || (data.value < 0 && { color: 'red' });
  }

  const [columnDefs, setColumnDefs] = useState([
    {field: 'symbol', filter: 'agTextColumnFilter', pinned: 'left', valueFormatter: null},
    {field: 'priceChange', cellStyle: cellColorStyle},
    {field: 'priceChangePercent', valueFormatter: percentFormatter, cellStyle: cellColorStyle},
    {field: 'weightedAvgPrice'},
    {field: 'prevClosePrice'},
    {field: 'lastPrice'},
    {field: 'lastQty'},
    {field: 'askPrice'},
    {field: 'askQty'},
    {field: 'openPrice'},
    {field: 'highPrice'},
    {field: 'lowPrice'},
    {field: 'volume'},
    {field: 'quoteVolume'},
    {field: 'openTime', valueFormatter: dateFormatter, filter: 'agDateColumnFilter'},
    {field: 'closeTime', valueFormatter: dateFormatter, filter: 'agDateColumnFilter'},
    {field: 'firstId'},
    {field: 'lastId'},
    {field: 'count'}
  ]);

  const defaultColDef = useMemo( () => ({
    sortable: true,
    filter:'agNumberColumnFilter',
    resizable: true,
    valueFormatter: numberOrPriceFormatter
  }), []);

  useEffect(() => {
    fetch('https://data.binance.com/api/v3/ticker/24hr')
    .then(result => result.json())
    .then(rowData => setRowData(rowData))
  },[])


  return (
    <>
      <div className='ag-theme-alpine' style={{height: 560 , width: 1200}}>
        <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationAutoPageSize={true}
        columnHoverHighlight={true}
        overlayLoadingTemplate='<div class="loader-spinner"/>'/>
      </div>
    </>
  )
}

export default App
