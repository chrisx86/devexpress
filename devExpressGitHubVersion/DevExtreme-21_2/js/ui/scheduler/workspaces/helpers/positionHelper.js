import { isDefined } from '../../../../core/utils/type';
import dateUtils from '../../../../core/utils/date';

const getCellSize = (DOMMetaData) => {
    const { dateTableCellsMeta } = DOMMetaData;
    const length = dateTableCellsMeta?.length;

    if(!length) {
        return {
            width: 0,
            height: 0
        };
    }

    const cellIndex = (length > 1) ? 1 : 0;
    const cellSize = dateTableCellsMeta[cellIndex][0];

    return {
        width: cellSize.width,
        height: cellSize.height,
    };
};

const getMaxAllowedHorizontalPosition = (groupIndex, viewDataProvider, isRtlEnabled, DOMMetaData) => {
    const { dateTableCellsMeta } = DOMMetaData;
    const firstRow = dateTableCellsMeta[0];

    if(!firstRow) return 0;

    const { columnIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const cellPosition = firstRow[columnIndex];

    if(!cellPosition) return 0;

    return !isRtlEnabled
        ? cellPosition.left + cellPosition.width
        : cellPosition.left;
};

export const getCellHeight = (DOMMetaData) => {
    return getCellSize(DOMMetaData).height;
};

export const getCellWidth = (DOMMetaData) => {
    return getCellSize(DOMMetaData).width;
};

export const getAllDayHeight = (isShowAllDayPanel, isVerticalGrouped, DOMMetaData) => {
    if(!isShowAllDayPanel) {
        return 0;
    }

    if(isVerticalGrouped) {
        const { dateTableCellsMeta } = DOMMetaData;
        const length = dateTableCellsMeta?.length;

        return length
            ? dateTableCellsMeta[0][0].height
            : 0;
    }

    const { allDayPanelCellsMeta } = DOMMetaData;

    return allDayPanelCellsMeta?.length
        ? allDayPanelCellsMeta[0].height
        : 0;
};

export const getMaxAllowedPosition = (groupIndex, viewDataProvider, isRtlEnabled, DOMMetaData) => {
    const validGroupIndex = groupIndex || 0;

    return getMaxAllowedHorizontalPosition(validGroupIndex, viewDataProvider, isRtlEnabled, DOMMetaData);
};

export const getMaxAllowedVerticalPosition = ({ groupIndex, viewDataProvider, isShowAllDayPanel, isGroupedAllDayPanel, isVerticalGrouped, DOMMetaData }) => {
    const { rowIndex } = viewDataProvider.getLastGroupCellPosition(groupIndex);
    const { dateTableCellsMeta } = DOMMetaData;
    const lastGroupRow = dateTableCellsMeta[rowIndex];

    if(!lastGroupRow) return 0;

    let result = lastGroupRow[0].top + lastGroupRow[0].height;

    // TODO remove while refactoring dual calculcations.
    // Should decrease allDayPanel amount due to the dual calculation corrections.
    if(isGroupedAllDayPanel) {
        result -= (groupIndex + 1) * getAllDayHeight(isShowAllDayPanel, isVerticalGrouped, DOMMetaData);
    }

    return result;
};

export const getGroupWidth = (groupIndex, viewDataProvider, options) => {
    const {
        isVirtualScrolling,
        rtlEnabled,
        DOMMetaData
    } = options;

    const cellWidth = getCellWidth(DOMMetaData);
    let result = viewDataProvider.getCellCount(options) * cellWidth;
    // TODO: refactor after deleting old render
    if(isVirtualScrolling) {
        const groupedData = viewDataProvider.groupedDataMap.dateTableGroupedMap;
        const groupLength = groupedData[groupIndex][0].length;

        result = groupLength * cellWidth;
    }

    const position = getMaxAllowedPosition(
        groupIndex,
        viewDataProvider,
        rtlEnabled,
        DOMMetaData
    );

    const currentPosition = position[groupIndex];

    if(currentPosition) {
        if(rtlEnabled) {
            result = currentPosition - position[groupIndex + 1];
        } else {
            if(groupIndex === 0) {
                result = currentPosition;
            } else {
                result = currentPosition - position[groupIndex - 1];
            }
        }
    }

    return result;
};

export class PositionHelper {
    constructor(options) {
        this.options = options;
    }

    get key() { return this.options.key; }
    get viewDataProvider() { return this.options.viewDataProvider; }
    get viewStartDayHour() { return this.options.viewStartDayHour; }
    get viewEndDayHour() { return this.options.viewEndDayHour; }
    get cellDuration() { return this.options.cellDuration; }
    get groupedStrategy() { return this.options.groupedStrategy; }
    get isGroupedByDate() { return this.options.isGroupedByDate; }
    get isRtlEnabled() { return this.options.isRtlEnabled; }
    get startViewDate() { return this.options.startViewDate; }
    get isVerticalGroupedWorkSpace() { return this.options.isVerticalGroupedWorkSpace; }
    get groupCount() { return this.options.groupCount; }
    get isVirtualScrolling() { return this.options.isVirtualScrolling; }
    get getPositionShift() { return this.options.getPositionShiftCallback; }
    get getDOMMetaData() { return this.options.getDOMMetaDataCallback; }

    getCoordinatesByDate(date, groupIndex, inAllDayRow) {
        const validGroupIndex = groupIndex || 0;

        const cellInfo = { groupIndex: validGroupIndex, startDate: date, isAllDay: inAllDayRow };
        const positionByMap = this.viewDataProvider.findCellPositionInMap(cellInfo);
        if(!positionByMap) {
            return undefined;
        }

        const position = this.getCellPosition(
            positionByMap,
            inAllDayRow && !this.isVerticalGroupedWorkSpace,
        );

        const timeShift = inAllDayRow
            ? 0
            : this.getTimeShift(date);

        const shift = this.getPositionShift(timeShift, inAllDayRow);
        const horizontalHMax = this.getHorizontalMax(validGroupIndex, date);

        return {
            cellPosition: position.left + shift.cellPosition,
            top: position.top + shift.top,
            left: position.left + shift.left,
            rowIndex: position.rowIndex,
            columnIndex: position.columnIndex,
            hMax: horizontalHMax,
            vMax: this.getVerticalMax(validGroupIndex),
            groupIndex: validGroupIndex
        };
    }

    getVerticalMax(groupIndex) {
        return this.groupedStrategy.getVerticalMax(groupIndex);
    }

    getCoordinatesByDateInGroup(startDate, groupIndices, inAllDayRow, groupIndex) {
        const result = [];

        if(this.viewDataProvider.isSkippedDate(startDate)) {
            return result;
        }

        let validGroupIndices = [groupIndex];

        if(!isDefined(groupIndex)) {
            validGroupIndices = this.groupCount
                ? groupIndices
                : [0];
        }

        validGroupIndices.forEach((groupIndex) => {
            const coordinates = this.getCoordinatesByDate(startDate, groupIndex, inAllDayRow);
            if(coordinates) {
                result.push(coordinates);
            }
        });

        return result;
    }

    getCellPosition(cellCoordinates, isAllDayPanel) {
        const {
            dateTableCellsMeta,
            allDayPanelCellsMeta,
        } = this.getDOMMetaData();
        const {
            columnIndex,
            rowIndex,
        } = cellCoordinates;

        const position = isAllDayPanel
            ? allDayPanelCellsMeta[columnIndex]
            : dateTableCellsMeta[rowIndex][columnIndex];

        const validPosition = { ...position };

        if(this.isRtlEnabled) {
            validPosition.left += position.width;
        }

        if(validPosition) {
            validPosition.rowIndex = cellCoordinates.rowIndex;
            validPosition.columnIndex = cellCoordinates.columnIndex;
        }

        return validPosition;
    }

    getTimeShift(date) {
        const currentDayStart = new Date(date);

        const currentDayEndHour = new Date(new Date(date).setHours(this.viewEndDayHour, 0, 0));

        if(date.getTime() <= currentDayEndHour.getTime()) {
            currentDayStart.setHours(this.viewStartDayHour, 0, 0, 0);
        }

        const timeZoneDifference = dateUtils.getTimezonesDifference(date, currentDayStart);
        const currentDateTime = date.getTime();
        const currentDayStartTime = currentDayStart.getTime();

        const minTime = this.startViewDate.getTime();

        return (currentDateTime > minTime)
            ? ((currentDateTime - currentDayStartTime + timeZoneDifference) % this.cellDuration) / this.cellDuration
            : 0;
    }

    getHorizontalMax(groupIndex) {
        const getMaxPosition = (groupIndex) => {
            return getMaxAllowedPosition(
                groupIndex,
                this.viewDataProvider,
                this.isRtlEnabled,
                this.getDOMMetaData()
            );
        };

        if(this.isGroupedByDate) {
            return Math.max(
                getMaxPosition(groupIndex),
                getMaxPosition(this.groupCount - 1),
            );
        }

        return getMaxPosition(groupIndex);
    }

    getResizableStep() {
        const cellWidth = getCellWidth(this.getDOMMetaData());

        if(this.isGroupedByDate) {
            return this.groupCount * cellWidth;
        }

        return cellWidth;
    }
}
