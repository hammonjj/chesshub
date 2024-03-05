import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import useUser from "../../hooks/useUser";
import { ExternalAccount } from "../../types";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditExternalAccountDialog from "../dialogs/EditExternalAccountDialog";

export default function ChessAccountAccordion() {
  const [expanded, setExpanded] = useState(false);
  const [editExternalAccount, setEditExternalAccount] = useState<ExternalAccount>();
  const [editExternalAccountModalOpen, setEditExternalAccountModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const { isLoading, externalAccounts, deleteExternalAccount, updateExternalAccount } = useUser();

  const [externalAccountToDelete, setExternalAccountToDelete] = useState<ExternalAccount>();

  return (
    <>
      <ConfirmDialog
        title={"Confirm Vehicle Deletion"}
        children="Are you sure you want to delete your linked account? This cannot be undone."
        open={confirmDeleteModalOpen}
        setOpen={setConfirmDeleteModalOpen}
        onConfirm={() => deleteExternalAccount(externalAccountToDelete!)}
      />
      {
        <EditExternalAccountDialog
          open={editExternalAccountModalOpen}
          externalAccount={editExternalAccount}
          handleClose={() => setEditExternalAccountModalOpen(false)}
          onSubmit={updateExternalAccount}
        />
      }
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary aria-controls="panel1d-content" id="chess-account-accordion" expandIcon={<ExpandMoreIcon />}>
          <Typography>Chess Accounts</Typography>
        </AccordionSummary>
        {isLoading ? (
          <AccordionDetails>
            <Typography>Loading</Typography>
          </AccordionDetails>
        ) : (
          externalAccounts?.map((externalAccount) => (
            <AccordionDetails
              key={externalAccount.accountName}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography>{externalAccount.platform}:</Typography>
              <Typography>{externalAccount.accountName}</Typography>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setEditExternalAccount(externalAccount);
                  setEditExternalAccountModalOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setExternalAccountToDelete(externalAccount);
                  setConfirmDeleteModalOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </AccordionDetails>
          ))
        )}
      </Accordion>
    </>
  );
}
