import useRefuels from "@hooks/useRefuels";
import { useState } from "react";
import VehicleDropdown from "@components/VehicleDropdown";
import { Refuel, Vehicle } from "@utils/types";
import AvgMpgDashboardCard from "@components/DashboardCards/AvgMpgDashboardCard";
import MilesDrivenDashboardCard from "@components/DashboardCards/MilesDrivenDashboardCard";
import AvgFillDashboardCard from "@components/DashboardCards/AvgFillDashboardCard";
import TotalCostDashboardCard from "@components/DashboardCards/TotalCostDashboardCard";
import AvgCostDashboardCard from "@components/DashboardCards/AvgCostDashboardCard";
import AvgPricePerGallonDashboardCard from "@components/DashboardCards/AvgPricePerGallonDashboardCard";
import { Tabs, Tab, Box } from "@mui/material";
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { getPreviousDate } from "@utils/helpers";
import { SvgIcon } from '@mui/material';
import SwipeContainer from "@components/SwipeContainer";

// Will implement this later, but it needs to be done for clarity
// enum DashboardTabs {
//   LastThreeMonths,
//   YearToDate,
//   Lifetime
// }

export default function Home() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [vehicle, setVehicle] = useState<Vehicle | null>();
  const { getRefuelsByVehicle } = useRefuels();

  function swipeCallback(_eventData: any, direction: string) {
    //Left: "left" -> Add one to current tab
    //Right: "right" -> Subtract one from current tab
    setCurrentTab((currentTab) => {
      if (direction === "left") {
        return (currentTab + 1) % 3;
      } else if (direction === "right") {
        return currentTab === 0 ? 2 : currentTab - 1;
      } else {
        return currentTab;
      }
    });
  }

  let refuels: Refuel[] = [];
  if(vehicle) {
    refuels = getRefuelsByVehicle(vehicle, false);
  }

  function onTabChange(_e: React.SyntheticEvent, value: number) {
    setCurrentTab(value);
  }

  return (
    <div style={{marginBottom: "5rem"}}>
      <h1>Home</h1>
      
      <div style={{marginBottom: "0.5rem"}}>
        <VehicleDropdown setVehicle={setVehicle}/>
      </div>

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
      <SwipeContainer callback={swipeCallback}>
      {Array.from({ length: 3 }, (_, i) => (
        <TabPanel key={i} value={currentTab} index={i}>
          <h2>{getTabTitle(i)}</h2>
          <AvgMpgDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
          <MilesDrivenDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
          <AvgFillDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
          <AvgPricePerGallonDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
          <AvgCostDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
          <TotalCostDashboardCard refuels={getFilteredRefuels(refuels, getTabDate(i))}/>
        </TabPanel>
      ))}
      </SwipeContainer>
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={props.value !== props.index}>
      {props.value === props.index && (<Box sx={{ p: 0 }}>{props.children}</Box>)}
    </div>
  );
}

function getTabTitle(index: number) {
  switch(index) {
    case 0:
      return "Last 3 Months";
    case 1:
      return "Year to Date";
    case 2:
      return "Lifetime";
    default:
      return "";
  }
}

function getFilteredRefuels(refuels: Refuel[], startDate: Date) {
  return refuels.filter((refuel) => {
    return (new Date(refuel.date) >= startDate);
  });
}

function getTabDate(index: number) {
  switch(index) {
    case 0:
      return getPreviousDate(3);
    case 1:
      return getPreviousDate(0, true);
    case 2:
      return getPreviousDate(100);
    default:
      console.log("Invalid tab index: ", index);
      return getPreviousDate(100);
  }
}