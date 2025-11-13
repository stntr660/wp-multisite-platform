import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPreferences } from "../store/slices/imageSlice";
import OptionIcon from "./icons/OptionIcon";
import Select from "./Select";

const MultiSelect = ({ item, Icon = <OptionIcon /> }) => {
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(null);

    // set initial selected value
	useEffect(() => {
		setSelected(item?.values[0]);
	}, [item?.values]);

    useEffect(() => {
        dispatch(setPreferences({ item, selected }));
    }, [selected, dispatch, item]);

    return (
        item?.values?.length > 1 && (
            <Select
                key={item?.id}
                Icon={Icon}
                items={item?.values}
                selected={selected}
                setSelected={setSelected}
            />
        )
    );
};

export default MultiSelect;
