'use server';

import { db, Member, Activity, Attendance } from '@/lib/db/db';
import { getSession } from '../auth/session';

async function requireRole(allowedRoles: ('ADMIN' | 'SUPERVISOR' | 'MEMBER')[], errorMessage = 'Akses ditolak.') {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    throw new Error(errorMessage);
  }
  return session;
}

export interface DashboardStatsAdmin {
  totalMembers: number;
  todayPresent: number;
  todayPermission: number;
  todaySick: number;
  todayAbsent: number;
  recentActivities: Activity[];
  recentAttendances: Array<Attendance & { memberName: string; activityTitle: string }>;
}

export interface DashboardStatsSupervisor {
  totalMembers: number;
  totalActivities: number;
  attendanceSummary: {
    present: number;
    permission: number;
    sick: number;
    absent: number;
  };
  recentActivities: Activity[];
}

export interface DashboardStatsMember {
  greeting: string;
  todayActivity: Activity | null;
  todayAttendanceStatus: 'NOT_SUBMITTED' | 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  todayAttendanceTime: string | null;
  attendancePercentage: number;
  totalActivities: number;
  totalPresent: number;
}

// 1. Admin Dashboard Stats
export async function getAdminDashboardStats(): Promise<DashboardStatsAdmin> {
  await requireRole(['ADMIN']);

  const members = db.getMembers().filter(m => m.status === 'ACTIVE');
  const activities = db.getActivities();
  const attendances = db.getAttendances();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(a => a.date === todayStr);
  const todayActivityIds = todayActivities.map(a => a.id);

  let todayPresent = 0;
  let todayPermission = 0;
  let todaySick = 0;
  let todayAbsent = 0;

  attendances.forEach(att => {
    if (todayActivityIds.includes(att.activityId)) {
      if (att.status === 'PRESENT') todayPresent++;
      else if (att.status === 'PERMISSION') todayPermission++;
      else if (att.status === 'SICK') todaySick++;
      else if (att.status === 'ABSENT') todayAbsent++;
    }
  });

  // Calculate today's Alpa (members who have not submitted attendance for today's completed or ongoing activities)
  // For simplicity: if today has an activity, active members without records are counted as absent by default
  if (todayActivities.length > 0) {
    const recordedMemberIds = new Set(attendances.filter(att => todayActivityIds.includes(att.activityId)).map(att => att.memberId));
    const activeMembersCount = members.length;
    const unrecordedCount = Math.max(0, activeMembersCount - recordedMemberIds.size);
    todayAbsent += unrecordedCount;
  }

  // Sort activities by date descending, take top 5
  const recentActivities = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Sort attendances by createdAt descending, take top 5
  const sortedAtts = [...attendances]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const recentAttendances = sortedAtts.map(att => {
    const m = db.getMemberById(att.memberId);
    const a = db.getActivityById(att.activityId);
    return {
      ...att,
      memberName: m?.fullName || 'Anggota Terhapus',
      activityTitle: a?.title || 'Kegiatan Terhapus',
    };
  });

  return {
    totalMembers: members.length,
    todayPresent,
    todayPermission,
    todaySick,
    todayAbsent,
    recentActivities,
    recentAttendances,
  };
}

// 2. Supervisor Dashboard Stats
export async function getSupervisorDashboardStats(): Promise<DashboardStatsSupervisor> {
  await requireRole(['SUPERVISOR', 'ADMIN']);

  const members = db.getMembers().filter(m => m.status === 'ACTIVE');
  const activities = db.getActivities();
  const attendances = db.getAttendances();

  let present = 0;
  let permission = 0;
  let sick = 0;
  let absent = 0;

  attendances.forEach(att => {
    if (att.status === 'PRESENT') present++;
    else if (att.status === 'PERMISSION') permission++;
    else if (att.status === 'SICK') sick++;
    else if (att.status === 'ABSENT') absent++;
  });

  // Include unrecorded attendance as absent for completed activities
  // Total expected attendances = active members * completed activities
  const completedActivitiesCount = activities.filter(a => a.status === 'COMPLETED').length;
  const expectedTotal = members.length * completedActivitiesCount;
  const recordedCount = attendances.filter(att => {
    const act = db.getActivityById(att.activityId);
    return act?.status === 'COMPLETED';
  }).length;
  const unrecordedAbsent = Math.max(0, expectedTotal - recordedCount);
  absent += unrecordedAbsent;

  const recentActivities = [...activities]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return {
    totalMembers: members.length,
    totalActivities: activities.length,
    attendanceSummary: {
      present,
      permission,
      sick,
      absent,
    },
    recentActivities,
  };
}

// 3. Member Dashboard Stats
export async function getMemberDashboardStats(): Promise<DashboardStatsMember> {
  const session = await requireRole(['MEMBER']);
  if (!session.memberId) {
    throw new Error('Akun Anda tidak terhubung dengan profil Anggota.');
  }

  const memberId = session.memberId;
  const todayStr = new Date().toISOString().split('T')[0];

  // Sapaan berdasarkan waktu
  const hour = new Date().getHours();
  let greeting = 'Selamat pagi';
  if (hour >= 11 && hour < 15) greeting = 'Selamat siang';
  else if (hour >= 15 && hour < 19) greeting = 'Selamat sore';
  else if (hour >= 19 || hour < 4) greeting = 'Selamat malam';

  // Today's activity
  const activities = db.getActivities();
  const todayActivity = activities.find(a => a.date === todayStr && a.status !== 'CANCELLED') || null;

  // Status attendance today
  let todayAttendanceStatus: DashboardStatsMember['todayAttendanceStatus'] = 'NOT_SUBMITTED';
  let todayAttendanceTime: string | null = null;

  if (todayActivity) {
    const att = db.getAttendanceByMemberAndActivity(memberId, todayActivity.id);
    if (att) {
      todayAttendanceStatus = att.status;
      if (att.checkIn) {
        const checkInDate = new Date(att.checkIn);
        todayAttendanceTime = checkInDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      }
    }
  }

  // Calculate percentage of attendance
  // only count active / completed activities
  const completedActivities = activities.filter(a => a.status === 'COMPLETED');
  const myAttendances = db.getAttendances().filter(att => att.memberId === memberId);

  const totalActivities = completedActivities.length;
  const presentCount = myAttendances.filter(att => {
    const act = completedActivities.find(a => a.id === att.activityId);
    return act && att.status === 'PRESENT';
  }).length;

  const attendancePercentage = totalActivities > 0 ? Math.round((presentCount / totalActivities) * 100) : 0;

  return {
    greeting,
    todayActivity,
    todayAttendanceStatus,
    todayAttendanceTime,
    attendancePercentage,
    totalActivities,
    totalPresent: presentCount,
  };
}

export interface ReportItem {
  memberId: string;
  name: string;
  className: string;
  presentCount: number;
  permissionCount: number;
  sickCount: number;
  absentCount: number;
  totalActivities: number;
  percentage: number;
}

// 4. Generate Reports
export async function generateAttendanceReport(filters: {
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalActivities: number;
  totalMembers: number;
  overallStats: {
    present: number;
    permission: number;
    sick: number;
    absent: number;
    percentage: number;
  };
  memberRekap: ReportItem[];
}> {
  await requireRole(['ADMIN', 'SUPERVISOR']);

  const activities = db.getActivities().filter(a => a.status === 'COMPLETED');
  const members = db.getMembers().filter(m => m.status === 'ACTIVE');
  const attendances = db.getAttendances();

  // Apply filters to activities
  let filteredActivities = [...activities];
  if (filters.startDate) {
    filteredActivities = filteredActivities.filter(a => a.date >= filters.startDate!);
  }
  if (filters.endDate) {
    filteredActivities = filteredActivities.filter(a => a.date <= filters.endDate!);
  }

  const filteredActivityIds = new Set(filteredActivities.map(a => a.id));
  const totalActivities = filteredActivities.length;

  let totalPresent = 0;
  let totalPermission = 0;
  let totalSick = 0;
  let totalAbsent = 0;

  const memberRekap: ReportItem[] = members.map(m => {
    let presentCount = 0;
    let permissionCount = 0;
    let sickCount = 0;
    let absentCount = 0;

    // Check each filtered activity
    filteredActivities.forEach(act => {
      const att = attendances.find(a => a.memberId === m.id && a.activityId === act.id);
      if (att) {
        if (att.status === 'PRESENT') {
          presentCount++;
          totalPresent++;
        } else if (att.status === 'PERMISSION') {
          permissionCount++;
          totalPermission++;
        } else if (att.status === 'SICK') {
          sickCount++;
          totalSick++;
        } else if (att.status === 'ABSENT') {
          absentCount++;
          totalAbsent++;
        }
      } else {
        // If unrecorded for a completed activity, count as ABSENT
        absentCount++;
        totalAbsent++;
      }
    });

    const percentage = totalActivities > 0 ? Math.round((presentCount / totalActivities) * 100) : 0;

    return {
      memberId: m.id,
      name: m.fullName,
      className: m.className,
      presentCount,
      permissionCount,
      sickCount,
      absentCount,
      totalActivities,
      percentage,
    };
  });

  const totalExpected = members.length * totalActivities;
  const overallPercentage = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

  return {
    totalActivities,
    totalMembers: members.length,
    overallStats: {
      present: totalPresent,
      permission: totalPermission,
      sick: totalSick,
      absent: totalAbsent,
      percentage: overallPercentage,
    },
    memberRekap,
  };
}
