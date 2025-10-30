import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/constants/svgIcon';
import axiosInstance from '@/services/api-services';
import URL_PATHS from '@/services/url-path';
import toastifyUtils from '@/utils/toastify';
import useStoreLoading from '@/store/loadingStore';
import { saveAs } from 'file-saver';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportExportDialog: React.FC<ImportExportDialogProps> = ({ open, onOpenChange }) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [overwrite, setOverwrite] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('export');
  const { showLoading, hideLoading } = useStoreLoading();

  // Xử lý chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra xem file có phải là .zip không
    if (file.type !== 'application/zip' && 
        file.type !== 'application/x-zip-compressed' && 
        !file.name.endsWith('.zip')) {
      toastifyUtils('error', 'Only .zip files are allowed');
      e.target.value = '';
      return;
    }

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toastifyUtils('error', 'File size should not exceed 10MB');
      e.target.value = '';
      return;
    }

    setImportFile(file);
  };

  // Xử lý export
  const handleExport = async () => {
    try {
      setExportLoading(true);
      showLoading();

      const response = await axiosInstance({
        method: 'POST',
        url: URL_PATHS.EXPORT_EMPLOYEES, // Đảm bảo đã thêm URL này vào URL_PATHS
        responseType: 'blob'
      });

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `employee-export-${timestamp}.zip`;

      // Tạo blob và tải về
      const blob = new Blob([response.data], { type: 'application/zip' });
      saveAs(blob, filename);

      toastifyUtils('success', 'Data exported successfully');
      
    } catch (error) {
      console.error('Export failed:', error);
      toastifyUtils('error', 'Failed to export data');
    } finally {
      setExportLoading(false);
      hideLoading();
    }
  };

  // Xử lý import
  const handleImport = async () => {
    if (!importFile) {
      toastifyUtils('error', 'Please select a file to import');
      return;
    }

    try {
      setImportLoading(true);
      setImportProgress(0);
      showLoading();

      const formData = new FormData();
      formData.append('file', importFile);
      
      // Thêm tham số overwrite nếu cần
      if (overwrite) {
        formData.append('overwrite', 'true');
      }

      const response = await axiosInstance({
        method: 'POST',
        url: URL_PATHS.IMPORT_EMPLOYEES, // Đảm bảo đã thêm URL này vào URL_PATHS
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setImportProgress(percentCompleted);
        }
      });

      setImportResult(response.data);
      toastifyUtils('success', 'Data imported successfully');

      // Reset form
      setImportFile(null);
      if (document.getElementById('import-file') as HTMLInputElement) {
        (document.getElementById('import-file') as HTMLInputElement).value = '';
      }
      
    } catch (error: any) {
      console.error('Import failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to import data';
      toastifyUtils('error', errorMessage);
    } finally {
      setImportLoading(false);
      hideLoading();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Employee Data Management</DialogTitle>
          <DialogDescription>
            Import or export employee data for backup or transfer.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-4">
              <Alert>
                <div className="flex items-start">
                  <Icons.Chart className="mt-0.5 h-4 w-4 mr-2" />
                  <AlertDescription>
                    The exported file will contain all employee information including personal details,
                    department, position, and roles. You can use this file for backup or to transfer data.
                  </AlertDescription>
                </div>
              </Alert>

              <Button 
                onClick={handleExport} 
                disabled={exportLoading} 
                className="w-full"
              >
                {exportLoading ? (
                  <>
                    <Icons.SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Icons.Download className="mr-2 h-4 w-4" />
                    Export Employee Data
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="import-file" className="text-sm font-medium">Select Import File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  disabled={importLoading}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Only .zip files are supported (max 10MB)</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="overwrite"
                  checked={overwrite}
                  onCheckedChange={setOverwrite}
                  disabled={importLoading}
                />
                <Label htmlFor="overwrite" className="text-sm font-medium cursor-pointer">
                  Overwrite existing records
                </Label>
              </div>

              <Alert variant="destructive">
                <div className="flex items-start">
                  <Icons.AlertTriangle className="mt-0.5 h-4 w-4 mr-2" />
                  <AlertDescription>
                    Importing data may overwrite existing employee records. Make sure you have a backup
                    before proceeding.
                  </AlertDescription>
                </div>
              </Alert>

              {importLoading && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {importProgress}% Complete
                  </p>
                </div>
              )}

              {importResult && (
                <div className="border rounded-md p-3 bg-muted/40 text-sm">
                  <p className="font-semibold mb-1">Import Results:</p>
                  <ul className="space-y-1">
                    <li>Processed: {importResult.total || 0} records</li>
                    <li className="text-green-600">Created: {importResult.created || 0}</li>
                    <li className="text-amber-600">Updated: {importResult.updated || 0}</li>
                    <li>Skipped: {importResult.skipped || 0}</li>
                    {importResult.errors?.length > 0 && (
                      <li className="text-red-500">Errors: {importResult.errors.length}</li>
                    )}
                  </ul>
                </div>
              )}

              <Button 
                onClick={handleImport} 
                disabled={!importFile || importLoading} 
                className="w-full"
              >
                {importLoading ? (
                  <>
                    <Icons.SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Icons.UploadIcon className="mr-2 h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;