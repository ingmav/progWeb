/// <reference lib="webworker" />
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { ReporteInventario } from './reporte-inventario';
import { ReporteInventarioPersonal } from './reporte-inventario-personal';
import { ReporteCardex } from './reporte-cardex';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const reportes = {
  'inventario/general'  : new ReporteInventario(),
  'inventario/personal'  : new ReporteInventarioPersonal(),
  'inventario/cardex'   : new ReporteCardex(),
};

addEventListener('message', ({ data }) => {
  const documentDefinition = reportes[data.reporte].getDocumentDefinition(data.data);

  let pdfReporte = pdfMake.createPdf(documentDefinition);

  pdfReporte.getBase64(function(encodedString) {
      let base64data = encodedString;
      //console.log(base64data);
      var bytes = atob( base64data ), len = bytes.length;
      var buffer = new ArrayBuffer( len ), view = new Uint8Array( buffer );
      for ( var i=0 ; i < len ; i++ )
        view[i] = bytes.charCodeAt(i) & 0xff;
      let file = new Blob( [ buffer ], { type: 'application/pdf' } );
      postMessage(file);
  });
});