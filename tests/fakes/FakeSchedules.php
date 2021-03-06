<?php
/**
Copyright 2011-2017 Nick Korbel

This file is part of Booked Scheduler.

Booked Scheduler is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Booked Scheduler is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Booked Scheduler.  If not, see <http://www.gnu.org/licenses/>.
*/

require_once(ROOT_DIR . 'Domain/Access/namespace.php');

class FakeScheduleRepository implements IScheduleRepository
{
	public $_GetAllCalled = false;

	/**
	 * @var array|Schedule[]
	 */
	public $_AllRows = array();

	public $_DefaultScheduleId = 1;
	public $_DefaultDaysVisible = 7;
	public $_DefaultStartTime = '06:00';
	public $_DefaultEndTime = '17:00';
	public $_DefaultDayStart = 0;

	/**
	 * @var FakeSchedule
	 */
	public $_Schedule;

	/**
	 * @var ScheduleLayout|null
	 */
	public $_Layout;

    /**
     * @var Schedule[]
     */
    public $_Schedules;

    public function __construct()
	{
		$this->_AllRows = $this->_GetAllRows();
		$this->_Schedule = new FakeSchedule();
	}

	/**
	 * @var Schedule
	 */
	public static $Schedule1;

	public static function Initialize()
	{
		self::$Schedule1 = new Schedule(1, "schedule 1", true, '09:00', '20:00', 0, 1, 5);
	}

	public function GetRows()
	{
		return array(
			self::GetRow($this->_DefaultScheduleId, 'schedule 1', 1, $this->_DefaultDayStart, $this->_DefaultDaysVisible, 'America/Chicago'),
			self::GetRow(2, 'schedule 1', 0, 0, 5, 'America/Chicago'),
		);
	}

	private function _GetAllRows()
	{
		$rows = $this->GetRows();
		$expected = array();

		foreach ($rows as $item)
		{
			$schedule = new Schedule(
				$item[ColumnNames::SCHEDULE_ID],
				$item[ColumnNames::SCHEDULE_NAME],
				$item[ColumnNames::SCHEDULE_DEFAULT],
				$item[ColumnNames::SCHEDULE_WEEKDAY_START],
				$item[ColumnNames::SCHEDULE_DAYS_VISIBLE],
				$item[ColumnNames::TIMEZONE_NAME]
			);
			$schedule->SetAdminGroupId($item[ColumnNames::SCHEDULE_ADMIN_GROUP_ID]);
			$expected[] = $schedule;
		}

		return $expected;
	}

	public function GetAll()
	{
		return array(new Schedule($this->_DefaultScheduleId, 'defaultsched', true, $this->_DefaultDayStart, $this->_DefaultDaysVisible));
	}

	public function AddScheduleLayout($scheduleId, ILayoutCreation $layout)
	{
		$schedule1 = new Schedule(100, 'sched1', false, DayOfWeek::MONDAY, 7);
		$defaultSchedule = new Schedule($this->_DefaultScheduleId, 'defaultsched', true, Schedule::Today, 7);
		return array($schedule1, $defaultSchedule);
	}

	public static function GetRow(
        $id = 1,
        $name = 'name',
        $isDefault = false,
        $weekdayStart = 0,
        $daysVisible = 7,
        $timezone = 'America/Chicago',
        $layoutId = null,
        $allowCalendarSubscription = false,
        $publicId = null,
		$adminId = null)
	{
		return array(
				ColumnNames::SCHEDULE_ID => $id,
				ColumnNames::SCHEDULE_NAME => $name,
				ColumnNames::SCHEDULE_DEFAULT => $isDefault,
				ColumnNames::SCHEDULE_WEEKDAY_START => $weekdayStart,
				ColumnNames::SCHEDULE_DAYS_VISIBLE => $daysVisible,
				ColumnNames::TIMEZONE_NAME => $timezone,
				ColumnNames::LAYOUT_ID => $layoutId,
                ColumnNames::ALLOW_CALENDAR_SUBSCRIPTION => $allowCalendarSubscription,
                ColumnNames::PUBLIC_ID => $publicId,
                ColumnNames::SCHEDULE_ADMIN_GROUP_ID => $adminId
			);
	}

	/**
	 * @param int $scheduleId
	 * @return Schedule
	 */
	public function LoadById($scheduleId)
	{
		return $this->_Schedule;
	}

	/**
	 * @param string $publicId
	 * @return Schedule
	 */
	public function LoadByPublicId($publicId)
	{
		// TODO: Implement LoadByPublicId() method.
	}

	/**
	 * @param Schedule $schedule
	 */
	public function Update(Schedule $schedule)
	{
		// TODO: Implement Update() method.
	}

	/**
	 * @param Schedule $schedule
	 */
	public function Delete(Schedule $schedule)
	{
		// TODO: Implement Delete() method.
	}

	/**
	 * @param Schedule $schedule
	 * @param int $copyLayoutFromScheduleId
	 * @return int $insertedScheduleId
	 */
	public function Add(Schedule $schedule, $copyLayoutFromScheduleId)
	{
		// TODO: Implement Add() method.
	}

	/**
	 * @param int $scheduleId
	 * @param ILayoutFactory $layoutFactory factory to use to create the schedule layout
	 * @return IScheduleLayout
	 */
	public function GetLayout($scheduleId, ILayoutFactory $layoutFactory)
	{
		return $this->_Layout;
	}

	/**
	 * @param int $pageNumber
	 * @param int $pageSize
	 * @param string|null $sortField
	 * @param string|null $sortDirection
	 * @param ISqlFilter $filter
	 * @return PageableData|Schedule[]
	 */
	public function GetList($pageNumber, $pageSize, $sortField = null, $sortDirection = null, $filter = null)
	{
		// TODO: Implement GetList() method.
	}

	/**
	 * @param int $scheduleId
	 * @param ScheduleLayout $layout
	 */
	public function UpdatePeakTimes($scheduleId, ScheduleLayout $layout)
	{
		// TODO: Implement UpdatePeakTimes() method.
	}
}