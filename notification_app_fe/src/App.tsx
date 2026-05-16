import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import "./App.css";
import {
  fetchNotifications,
  getPriorityNotifications
} from "./api/notificationsApi";
import type {
  NotificationFilters,
  NotificationItem,
  NotificationTypeFilter
} from "./types";

function App() {
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<NotificationFilters>({
    limit: 10,
    page: 1,
    notificationType: "All"
  });

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNotifications(filters);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [filters.page, filters.limit, filters.notificationType]);

  function markAsViewed(id: string) {
    setViewedIds((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  const updatedNotifications = notifications.map((item) => ({
    ...item,
    viewed: item.viewed || viewedIds.includes(item.ID)
  }));

  const priorityNotifications = getPriorityNotifications(
    updatedNotifications,
    filters.limit,
    filters.notificationType
  );

  const visibleNotifications =
    tab === 0 ? updatedNotifications : priorityNotifications;

  return (
    <Container maxWidth="lg" className="page">
      <Box className="header">
        <Typography variant="h4" fontWeight={700}>
          Campus Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all notifications and priority unread updates.
        </Typography>
      </Box>

      <Card className="filter-card">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Limit"
                type="number"
                value={filters.limit}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    limit: Number(event.target.value) || 10
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Page"
                type="number"
                value={filters.page}
                onChange={(event) =>
                  setFilters({
                    ...filters,
                    page: Number(event.target.value) || 1
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Notification Type</InputLabel>
                <Select
                  label="Notification Type"
                  value={filters.notificationType}
                  onChange={(event) =>
                    setFilters({
                      ...filters,
                      notificationType: event.target
                        .value as NotificationTypeFilter
                    })
                  }
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Placement">Placement</MenuItem>
                  <MenuItem value="Result">Result</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button variant="contained" className="refresh-btn" onClick={loadNotifications}>
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="All Notifications" />
        <Tab label="Priority Notifications" />
      </Tabs>

      {loading && <Alert severity="info">Loading notifications...</Alert>}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && visibleNotifications.length === 0 && (
        <Alert severity="warning">No notifications found.</Alert>
      )}

      <Grid container spacing={2} className="notification-list">
        {visibleNotifications.map((item) => {
          const isNew = !item.isRead && !item.viewed;

          return (
            <Grid item xs={12} md={6} key={item.ID}>
              <Card className={isNew ? "notification-card new-card" : "notification-card"}>
                <CardContent>
                  <Box className="card-top">
                    <Chip
                      label={item.Type}
                      color={
                        item.Type === "Placement"
                          ? "primary"
                          : item.Type === "Result"
                          ? "success"
                          : "default"
                      }
                    />

                    <Chip
                      label={isNew ? "New" : "Viewed"}
                      color={isNew ? "warning" : "default"}
                      variant={isNew ? "filled" : "outlined"}
                    />
                  </Box>

                  <Typography variant="h6" className="message">
                    {item.Message}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.Timestamp}
                  </Typography>

                  {tab === 1 && (
                    <Typography variant="body2" className="score">
                      Priority Score: {Math.round(item.priorityScore || 0)}
                    </Typography>
                  )}

                  {isNew && (
                    <Button
                      variant="outlined"
                      size="small"
                      className="view-btn"
                      onClick={() => markAsViewed(item.ID)}
                    >
                      Mark as viewed
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default App;