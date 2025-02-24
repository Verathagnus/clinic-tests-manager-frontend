// src/components/UtilityComponent.tsx
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/utils/api";
import { Input } from "@/components/ui/input";

const UtilityComponent = () => {
  const handleCreateBackup = async () => {
    try {
      const response = await api.get('/backup/create', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup_${new Date().toISOString()}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Backup created and downloaded successfully');
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    }
  };

  const handleGenerateEditsReport = async (format: string) => {
    try {
      const response = await api.get(`/report/edits?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edits_report_${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Edits report generated and downloaded successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating edits report:', error);
      toast.error('Failed to generate edits report');
    }
  };

  const handleGenerateInvoicesReport = async (format: string) => {
    try {
      const response = await api.get(`/report/invoices?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_report_${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Invoices report generated and downloaded successfully (${format.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating invoices report:', error);
      toast.error('Failed to generate invoices report');
    }
  };

  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      await api.post('/backup/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the response status is 200 and handle any additional success indicators
      // if (response.status >= 200 && response.status < 300) {
        toast.success('Backup restored successfully');
      // } else {
        // toast.error(`Failed to restore backup: ${response.statusText}`);
      // }
    } catch (error) {
      console.log('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Utilities</h2>
      <div className="space-y-4">
        <Button onClick={handleCreateBackup} className="w-full">
          Create Backup
        </Button>
        <div className="flex gap-4">
          <Button onClick={() => handleGenerateEditsReport('csv')} className="w-full">
            Download Edits Report (CSV)
          </Button>
          <Button onClick={() => handleGenerateEditsReport('xlsx')} className="w-full">
            Download Edits Report (Excel)
          </Button>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => handleGenerateInvoicesReport('csv')} className="w-full">
            Download Invoices Report (CSV)
          </Button>
          <Button onClick={() => handleGenerateInvoicesReport('xlsx')} className="w-full">
            Download Invoices Report (Excel)
          </Button>
        </div>
        <div>
          <Input
            id="restore-backup-input"
            type="file"
            accept=".sql"
            style={{ display: 'none' }}
            onChange={handleRestoreBackup}
          />
          <Button onClick={() => document.getElementById('restore-backup-input')?.click()} className="w-full">
            Restore Backup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UtilityComponent;