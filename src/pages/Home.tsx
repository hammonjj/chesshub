import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { SvgIcon } from '@mui/material';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  function onTabChange(_e: React.SyntheticEvent, value: number) {
    setCurrentTab(value);
  }

  return (
    <div style={{marginBottom: "5rem"}}>
      <h1>Home</h1>

      {/* Time Controls */}
      {/* Latest Games */}
      <Tabs 
        value={currentTab} 
        onChange={onTabChange} 
        aria-label="metrics tabs"
        centered={true}
        TabIndicatorProps={{style: {background:'transparent'}}}
      >
        {Array.from({ length: 3 }, (_, i) => (
          <Tab key={i} icon={
            <SvgIcon fontSize="inherit" style={{fontSize: "17px"}}>
              {currentTab === i ? <FiberManualRecordIcon /> : <FiberManualRecordOutlinedIcon />}
            </SvgIcon>}
          />
        ))}
      </Tabs>
    </div>
  );
}