import React from "react";
import Card from "../../components/cards/Card";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import Select from "react-select";

function Settings() {
    const languages = [
        { value: "Swahili", label: "Swahili" },
        { value: "English", label: "English" },
      ];

      const reportEmailSchedule = [
        { value: "Everyday", label: "Everyday" },
        { value: "Everyweek", label: "Everyweek" },
        { value: "EveryMonth", label: "EveryMonth" },
      ];

      const reportEmailScheduleTimeline = [
        { value: "Morning", label: "Morning" },
        { value: "Afternoon", label: "Afternoon" },
        { value: "Eveninig", label: "Eveninig" },
        { value: "Night", label: "Night" },
      ];

      const reportEmailScheduleTimelineAt = [
        { value: "10:00 am", label: "10:00 am" },
        { value: "03:00 pm", label: "03:00 pm" },
        { value: "05:00 pm", label: "05:00 pm" },
        { value: "09:00 pm", label: "09:00pm" },
      ];

  return (
    <>
      <Card>
        <Form header={"App Settings"} submitBtnTxt={"Save Changes"}>
          <div className="form-layouts form-layout-left">
            <p>Languages</p>
            <br />
            <Select options={languages} /><br /><br />
            <p>Set report email schedule</p>
            <br />
            <Select options={reportEmailSchedule} />
            <Select options={reportEmailScheduleTimeline} />
            <Select options={reportEmailScheduleTimelineAt} />
          </div>
          <div className="form-layouts form-layout-right">
            <br />
          </div>
        </Form>
      </Card>
    </>
  );
}

export default Settings;
