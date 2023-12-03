import { useState } from "react";
import { useParams } from "react-router-dom";
// styles
import { Box, Typography } from "@mui/material";
import type { SxStyle } from "@app.types/app";
// hooks
import { useInternalRouter } from "@app.hooks/route";
import {
  DeleteRecordByOpponentMutation,
  useGetRecordByOpponent,
} from "@app.hooks/user";
// components
import PageWithGoBack from "@app.layout/PageWithGoBack";
import FloatingUploadButton from "@app.component/atom/FloatingUploadButton";
import { ReactComponent as Delete } from "/public/icon/Delete.svg";
import RecordCard from "@app.component/template/RecordCard";
import Spacer from "@app.component/atom/Spacer";
import OpponentEmpty from "@app.component/page/opponent/OpponentEmpty";
import AppModal from "@app.component/template/AppModal";

export default function OpponentPage() {
  const router = useInternalRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { opponent } = useParams();

  const { data } = useGetRecordByOpponent(opponent);

  const { mutateAsync } = DeleteRecordByOpponentMutation();
  if (!opponent || !data || "error" in data) return null;

  const deleteOpponent = async () => {
    if (!data?.opponent) return;
    const res = await mutateAsync(data.opponent);
    if (!(res && "error" in res)) {
      router.replace("/");
    }
  };

  return (
    <PageWithGoBack>
      <Box sx={styles.container}>
        <Spacer y={18} />
        <Box className="header">
          <Typography className="opponent">{opponent}</Typography>
          <Delete onClick={() => setOpenDeleteModal(true)} />
        </Box>

        <Spacer y={44} />

        <Box className="recordArea">
          {data.record.length ? (
            data.record.map((data) => (
              <RecordCard key={data.id} opponent={opponent} record={data} />
            ))
          ) : (
            <OpponentEmpty opponent={opponent} />
          )}
        </Box>
      </Box>

      <AppModal
        open={openDeleteModal}
        title="잠시만요!"
        type="confirm"
        btn1Text="확인"
        btn1Handler={deleteOpponent}
        btn2Text="취소"
        btn2Handler={() => setOpenDeleteModal(false)}
      >
        모든 통화내역이 사라져요.
        <br />
        그래도 삭제하시겠어요?
      </AppModal>
      <FloatingUploadButton state={{ opponent }} />
    </PageWithGoBack>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    "& .header": {
      display: "flex",
      width: "100%",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      "& .opponent": {
        color: "#525252",
        fontSize: "20px",
        fontWeight: 600,
        letterSpacing: "-1px",
      },
      "& svg": {
        cursor: "pointer",
        position: "absolute",
        right: 0,
      },
    },
    "& .recordArea": {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      "& > div:not(:last-child)": { mb: "20px" },
    },
  },
} satisfies SxStyle;
