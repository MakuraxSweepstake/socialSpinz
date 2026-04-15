
import { Button, Dialog, DialogContent, IconButton, InputAdornment, OutlinedInput, useMediaQuery } from "@mui/material";
import SelectField from "../atom/SelectField";
import { ArrowDown, DocumentDownload, SearchNormal } from "@wandersonalwes/iconsax-react";
import React from "react";
import Filter from "../organism/Filter";
import dayjs, { Dayjs } from "dayjs";
import DateRangePicker from "./DateRangePicker";


interface FilterOption {
    value: string;
    label: string;
}

interface TableHeaderProps {
    search: string;
    setSearch?: (value: string) => void;

    // Single filter support
    filterMethod?: string;
    setFilterMethod?: (value: string) => void;

    // Multiple filters support
    filters?: { value: string; setValue: (value: string) => void; options: FilterOption[], placeholder?: string }[];
    filterOptions?: FilterOption[];
    onDownloadCSV?: () => void;
    downloading?: boolean;
    debounceDelay?: number;
    customRange?: {
        startDate: string;
        endDate: string;
    };
    setCustomRange?: React.Dispatch<
        React.SetStateAction<{ startDate: string; endDate: string }>
    >;

}

export default function TableHeader({
    search,
    setSearch,
    filterMethod,
    setFilterMethod,
    filters,
    onDownloadCSV,
    filterOptions,
    downloading,
    debounceDelay = 500,
    customRange,
    setCustomRange,
}: TableHeaderProps) {
    const downMD = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    const [localSearch, setLocalSearch] = React.useState(search);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (setSearch && localSearch !== search) {
                setSearch(localSearch);
            }
        }, debounceDelay);

        return () => {
            clearTimeout(handler);
        };
    }, [localSearch, debounceDelay]);

    React.useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    const [startDate, setStartDate] = React.useState<Dayjs | null>(
        customRange?.startDate ? dayjs(customRange.startDate) : null
    );
    const [endDate, setEndDate] = React.useState<Dayjs | null>(
        customRange?.endDate ? dayjs(customRange.endDate) : null
    );
    const [showCustomRangeModal, setShowCustomRangeModal] = React.useState(false);

    const handleApplyCustomRange = () => {
        if (startDate) {
            setCustomRange && setCustomRange({
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
            });
            setShowCustomRangeModal(false);
        }
    };

    const handleResetCustomRange = () => {
        setStartDate(null);
        setEndDate(null);
        setCustomRange && setCustomRange({ startDate: "", endDate: "" });
        setShowCustomRangeModal(false);
    };

    return (
        <div className="table__header p-4 mb-4 flex flex-wrap justify-between items-center gap-4">
            {/* Search Field */}
            <div className="inpute__field relative">
                <OutlinedInput
                    placeholder="Search keywords..."
                    name="search"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch && setSearch(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconButton edge="start">
                                <SearchNormal size={20} />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </div>


            {/* Filters */}
            <div className="header-right flex flex-wrap justify-end items-center gap-2">
                {/* Multi-filter mode */}
                {filters?.map((f, idx) => (
                    <SelectField
                        key={idx}
                        name={`filter-${idx}`}
                        value={f.value}
                        onChange={(e) => f.setValue && f.setValue(e.target.value)}
                        options={f.options.map(opt => ({ value: opt.value, name: opt.label }))}
                        placeholder={f.placeholder && f.placeholder}
                    />
                ))}

                {/* Legacy single filter mode */}
                {filterOptions && filterMethod !== undefined && setFilterMethod && (
                    <SelectField
                        name="filter"
                        value={filterMethod}
                        onChange={(e) => setFilterMethod(e.target.value)}
                        options={filterOptions.map(opt => ({ value: opt.value, name: opt.label }))}
                    />
                )}

                {/* <Filter /> */}
                {customRange ? (
                    <>
                        <Button
                            startIcon={!downMD && <ArrowDown size={16} />}
                            onClick={() => setShowCustomRangeModal(true)}
                            sx={{
                                borderRadius: "8px",
                                border: "1px solid var(--Gray, #E0E0E3)",
                                padding: "8px 16px",
                                color: "#0E0E11",
                                maxWidth: "fit-content",
                            }}
                        >
                            Filter By Date
                        </Button>

                        <Dialog
                            open={showCustomRangeModal}
                            onClose={() => setShowCustomRangeModal(false)}
                            maxWidth="xs"
                            fullWidth
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    backgroundColor: "rgba(0,0,0,0.8)", // ✅ visible background
                                    boxShadow: 3, // ✅ subtle shadow
                                    padding: 2,
                                },
                            }}
                        >
                            <DialogContent sx={{ p: 0 }}>
                                <DateRangePicker
                                    startDate={startDate}
                                    endDate={endDate}
                                    onStartDateChange={setStartDate}
                                    onEndDateChange={setEndDate}
                                    onApply={handleApplyCustomRange}
                                    onReset={handleResetCustomRange}
                                />
                            </DialogContent>
                        </Dialog>
                    </>) : ""}

                {/* Download Button */}
                {onDownloadCSV && <Button
                    startIcon={!downMD && <DocumentDownload size={16} />}
                    onClick={onDownloadCSV}
                    sx={{
                        borderRadius: "8px",
                        border: "1px solid var(--Gray, #E0E0E3)",
                        padding: "8px 16px",
                        color: "#0E0E11",
                        maxWidth: "fit-content",
                    }}
                >
                    {downMD ? <DocumentDownload size={16} /> : downloading ? "Downloading..." : "Download CSV"}
                </Button>}
            </div>

        </div>
    );
}
