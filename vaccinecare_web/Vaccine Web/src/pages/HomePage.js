import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Vaccines as VaccinesIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [userAppointments, setUserAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchUserAppointments();
  }, [currentUser, navigate]);

  const fetchUserAppointments = async () => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const vaccinesRef = collection(db, 'vaccines');
      const q = query(vaccinesRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching vaccines:', error);
      setSnackbarMessage('Error searching vaccines');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!appointmentDate || !appointmentTime || !selectedVaccine) return;
    
    try {
      const appointmentData = {
        userId: currentUser.uid,
        vaccineId: selectedVaccine.id,
        vaccineName: selectedVaccine.name,
        date: appointmentDate,
        time: appointmentTime,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, appointmentData);

      // Update vaccine availability
      const vaccineRef = doc(db, 'vaccines', selectedVaccine.id);
      await updateDoc(vaccineRef, {
        availableDoses: increment(-1)
      });

      setSnackbarMessage('Appointment booked successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenDialog(false);
      fetchUserAppointments();
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSnackbarMessage('Error booking appointment');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click
    console.log('Notification clicked:', notification);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1a237e', fontWeight: 600 }}>
            VaccineCare
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="primary">
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1a237e' }}>
                {currentUser?.email?.[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CalendarIcon sx={{ mr: 1 }} /> My Appointments
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'white' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
            Find Your Vaccine
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search for available vaccines and book your appointment
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search vaccines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#1a237e', mr: 1 }} />
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                bgcolor: '#1a237e',
                '&:hover': { bgcolor: '#0d47a1' },
                px: 4
              }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {searchResults.map((vaccine) => (
            <Grid item xs={12} md={6} lg={4} key={vaccine.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VaccinesIcon sx={{ color: '#1a237e', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                      {vaccine.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {vaccine.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HospitalIcon sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {vaccine.hospital}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {vaccine.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ color: '#1a237e', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {vaccine.availableTime}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Chip 
                      label={`${vaccine.availableDoses} doses available`}
                      color={vaccine.availableDoses > 0 ? 'success' : 'error'}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedVaccine(vaccine);
                        setOpenDialog(true);
                      }}
                      disabled={vaccine.availableDoses === 0}
                      sx={{
                        bgcolor: '#1a237e',
                        '&:hover': { bgcolor: '#0d47a1' }
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
            Book Appointment
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Appointment Date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="time"
                label="Appointment Time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleBookAppointment}
              disabled={!appointmentDate || !appointmentTime}
              sx={{
                bgcolor: '#1a237e',
                '&:hover': { bgcolor: '#0d47a1' }
              }}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomePage; 