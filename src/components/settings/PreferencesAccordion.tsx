import { useContext, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Switch } from "@mui/material";
import SettingsContext from "../../contexts/SettingsContext";

export default function PreferencesAccordion() {
  const [expanded, setExpanded] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(SettingsContext);

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} >
      <AccordionSummary aria-controls="panel1d-content" id="vehicle-accordion" expandIcon={<ExpandMoreIcon />}>
        <Typography>Preferences</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Dark Mode:</Typography>
        <Switch onChange={toggleDarkMode} checked={darkMode} />
      </AccordionDetails>
    </Accordion>
  );
}
