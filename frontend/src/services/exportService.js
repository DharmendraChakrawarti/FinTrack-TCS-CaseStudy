import api from './api';

const exportService = {
  downloadCsv: async (startDate, endDate) => {
    const response = await api.get('/export/csv', {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance_report_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadPdf: async (startDate, endDate) => {
    const response = await api.get('/export/pdf', {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance_report_${startDate}_${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default exportService;
