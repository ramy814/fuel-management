import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Power,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalGasStation,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store';
import { GeneratorForm } from '../components/forms/GeneratorForm';
import { Generator, CreateGeneratorDTO, UpdateGeneratorDTO } from '../types';
import {
  fetchGeneratorsAsync,
  createGeneratorAsync,
  updateGeneratorAsync,
  deleteGeneratorAsync,
  setSelectedGenerator,
} from '../store/slices/generatorsSlice';
import { showSnackbar } from '../store/slices/uiSlice';

export const GeneratorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    generators, 
    loading, 
    error, 
    selectedGenerator 
  } = useSelector((state: RootState) => state.generators);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generatorToDelete, setGeneratorToDelete] = useState<Generator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGenerators, setFilteredGenerators] = useState<Generator[]>([]);

  useEffect(() => {
    dispatch(fetchGeneratorsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredGenerators(
        generators.filter(generator =>
          generator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          generator.vehicleNum?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          generator.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredGenerators(generators);
    }
  }, [generators, searchTerm]);

  const handleRefresh = () => {
    dispatch(fetchGeneratorsAsync());
  };

  const handleAddGenerator = () => {
    dispatch(setSelectedGenerator(null));
    setFormOpen(true);
  };

  const handleEditGenerator = (generator: Generator) => {
    dispatch(setSelectedGenerator(generator));
    setFormOpen(true);
  };

  const handleDeleteGenerator = (generator: Generator) => {
    setGeneratorToDelete(generator);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (generatorToDelete) {
      try {
        await dispatch(deleteGeneratorAsync(generatorToDelete.oid));
        dispatch(showSnackbar({
          message: 'تم حذف المولد بنجاح',
          severity: 'success'
        }));
        setDeleteDialogOpen(false);
        setGeneratorToDelete(null);
      } catch (error) {
        dispatch(showSnackbar({
          message: 'حدث خطأ أثناء حذف المولد',
          severity: 'error'
        }));
      }
    }
  };

  const handleFormSubmit = async (data: CreateGeneratorDTO | UpdateGeneratorDTO) => {
    try {
      if (selectedGenerator) {
        await dispatch(updateGeneratorAsync(data as UpdateGeneratorDTO));
        dispatch(showSnackbar({
          message: 'تم تحديث بيانات المولد بنجاح',
          severity: 'success'
        }));
      } else {
        await dispatch(createGeneratorAsync(data as CreateGeneratorDTO));
        dispatch(showSnackbar({
          message: 'تم إضافة المولد بنجاح',
          severity: 'success'
        }));
      }
      setFormOpen(false);
    } catch (error) {
      dispatch(showSnackbar({
        message: 'حدث خطأ أثناء حفظ بيانات المولد',
        severity: 'error'
      }));
    }
  };

  const GeneratorCard: React.FC<{ generator: Generator }> = ({ generator }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <Power sx={{ fontSize: 24 }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {generator.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              #{generator.oid}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {generator.vehicleNum && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                مركبة:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {generator.vehicleNum}
              </Typography>
            </Box>
          )}

          {generator.engineCapacity && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                القدرة:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {generator.engineCapacity} كيلو واط
              </Typography>
            </Box>
          )}

          {generator.fuelTypeName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGasStation sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {generator.fuelTypeName}
              </Typography>
            </Box>
          )}

          {generator.assignedToName && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={generator.assignedToName}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditGenerator(generator)}
            title="تعديل"
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            size="small"
            color="primary"
            title="عرض التفاصيل"
          >
            <ViewIcon />
          </IconButton>
        </Box>
        
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteGenerator(generator)}
          title="حذف"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          إدارة المولدات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة وتتبع جميع مولدات البلدية
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="البحث باسم المولد أو رقم المركبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                variant="outlined"
                size="small"
              >
                تحديث
              </Button>
              
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddGenerator}
                variant="contained"
                size="small"
              >
                إضافة مولد
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Generators Grid */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>جاري التحميل...</Typography>
        </Box>
      ) : filteredGenerators.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Power sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'لا توجد نتائج بحث' : 'لا توجد مولدات مسجلة'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm 
              ? 'جرب تغيير كلمات البحث أو مسح الفلاتر'
              : 'ابدأ بإضافة أول مولد في النظام'
            }
          </Typography>
          {!searchTerm && (
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddGenerator}
              variant="contained"
            >
              إضافة مولد جديد
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredGenerators.map((generator) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={generator.oid}>
              <GeneratorCard generator={generator} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Statistics */}
      {!loading && filteredGenerators.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            إجمالي المولدات: {filteredGenerators.length}
            {searchTerm && ` (من أصل ${generators.length})`}
          </Typography>
        </Paper>
      )}

      {/* Generator Form Dialog */}
      <GeneratorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        generator={selectedGenerator}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد من حذف المولد "{generatorToDelete?.name}"؟
            هذا الإجراء لا يمكن التراجع عنه.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};