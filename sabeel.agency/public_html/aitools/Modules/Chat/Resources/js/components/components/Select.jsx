import { Fragment } from "react";
import cn from "../utils/cn";
import { CheckIcon, OptionIcon } from "./icons";
import { Listbox, Transition } from "@headlessui/react";
import ChevronUpDownIcon from "./icons/ChevronUpDownIcon";

const Select = ({
    items,
    selected,
    setSelected,
    Icon = <OptionIcon />,
    className,
    centralize = false,
}) => {
    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
                <Listbox.Button
                    className={cn(
                        "w-fit relative bg-white dark:bg-dark-shade-1 rounded-full z-10 border border-gray-2 hover:border-gray-1 dark:border-clr47 dark:hover:border-gray-1 py-[6.5px] px-3 text-left outline-none text-sm font-normal text-dark-1 dark:text-white transition",
                        className
                    )}
                >
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {Icon ? Icon : null}
                    </span>
                    <span className="block truncate pl-6 pr-3.5">
                        {selected?.name ? selected?.name : selected?.value}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-0 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-300 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-0 opacity-0"
                >
                    <Listbox.Options className={cn("absolute -top-2 transform -translate-y-full origin-bottom shadow-input max-h-60 w-fit overflow-auto rounded-md bg-white dark:bg-dark-shade-1 text-sm border text-dark-1 dark:text-white border-gray-2 dark:border-gray-1 focus:outline-none z-50", {"left-1/2 -translate-x-1/2" : centralize})}>
                        {items?.map((item, itemIdx) => (
                            <Listbox.Option
                                key={itemIdx}
                                className={({ selected, active }) =>
                                    cn('relative cursor-pointer select-none py-2 pl-10 pr-5', {
                                        'bg-bg-1 dark:bg-dark-shade-2': selected || active,
                                        'hover:bg-bg-1 hover:dark:bg-dark-shade-2': !selected && !active
                                    })
                                }
                                value={item}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            {Icon ? Icon : null}
                                        </span>
                                        <span
                                            className={`pr-8 block truncate ${
                                                selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                            }`}
                                        >
                                            {item?.name ? item?.name : item.value}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <CheckIcon />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default Select;
