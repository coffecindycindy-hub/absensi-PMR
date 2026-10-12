import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  nis: string;
  fullName: string;
  className: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  position: 'CHAIRMAN' | 'VICE_CHAIRMAN' | 'SECRETARY' | 'TREASURER' | 'COORDINATOR' | 'MEMBER';
  photoUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  activityId: string;
  status: 'PRESENT' | 'PERMISSION' | 'SICK' | 'ABSENT';
  checkIn: string | null; // ISO datetime
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: User[];
  members: Member[];
  activities: Activity[];
  attendances: Attendance[];
}

// Safe fallback to /tmp if process.cwd() is read-only (common in Serverless/Cloud Run environments)
let DB_FILE_PATH = path.join(process.cwd(), 'data', 'database.json');

try {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const testFile = path.join(dir, '.write_test');
  fs.writeFileSync(testFile, 'test', 'utf-8');
  fs.unlinkSync(testFile);
} catch (e) {
  console.warn('Current directory is read-only, falling back to /tmp/database.json');
  DB_FILE_PATH = path.join('/tmp', 'database.json');
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    members: [],
    activities: [],
    attendances: []
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to create database directory', e);
    }

    // Crucial: If falling back to /tmp, copy the pre-seeded database from the read-only workspace if /tmp/database.json doesn't exist
    if (DB_FILE_PATH.startsWith('/tmp') && !fs.existsSync(DB_FILE_PATH)) {
      const originalPath = path.join(process.cwd(), 'data', 'database.json');
      if (fs.existsSync(originalPath)) {
        try {
          console.log(`Copying pre-seeded database from ${originalPath} to ${DB_FILE_PATH}`);
          fs.copyFileSync(originalPath, DB_FILE_PATH);
        } catch (e) {
          console.error('Failed to copy pre-seeded database to /tmp', e);
        }
      }
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (e) {
        console.error('Failed to parse database file, initializing empty', e);
        this.data = { users: [], members: [], activities: [], attendances: [] };
        this.save();
      }
    } else {
      this.seed();
    }
  }

  private save() {
    try {
      const tempPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (e) {
      console.error('Failed to write database file', e);
    }
  }

  private seed() {
    console.log('Seeding initial PMR Attendance database...');
    const salt = bcrypt.genSaltSync(10);

    // 1. Admin PMR
    const adminUser: User = {
      id: 'usr-admin',
      name: 'Admin PMR',
      email: 'admin@pmr.local',
      passwordHash: bcrypt.hashSync('admin123', salt),
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Supervisor / Pembina
    const supervisorUser: User = {
      id: 'usr-supervisor',
      name: 'Pembina PMR',
      email: 'pembina@pmr.local',
      passwordHash: bcrypt.hashSync('pembina123', salt),
      role: 'SUPERVISOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. Members
    const memberUser1: User = {
      id: 'usr-member-1',
      name: 'Ahmad Fauzi',
      email: 'ahmad@pmr.local',
      passwordHash: bcrypt.hashSync('member123', salt),
      role: 'MEMBER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const member1: Member = {
      id: 'mem-1',
      userId: 'usr-member-1',
      nis: '12345',
      fullName: 'Ahmad Fauzi',
      className: 'X-A',
      gender: 'MALE',
      phone: '081234567890',
      position: 'CHAIRMAN',
      photoUrl: '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const memberUser2: User = {
      id: 'usr-member-2',
      name: 'Siti Aminah',
      email: 'siti@pmr.local',
      passwordHash: bcrypt.hashSync('member123', salt),
      role: 'MEMBER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const member2: Member = {
      id: 'mem-2',
      userId: 'usr-member-2',
      nis: '12346',
      fullName: 'Siti Aminah',
      className: 'XI-B',
      gender: 'FEMALE',
      phone: '081234567891',
      position: 'SECRETARY',
      photoUrl: '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const memberUser3: User = {
      id: 'usr-member-3',
      name: 'Rizky Pratama',
      email: 'rizky@pmr.local',
      passwordHash: bcrypt.hashSync('member123', salt),
      role: 'MEMBER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const member3: Member = {
      id: 'mem-3',
      userId: 'usr-member-3',
      nis: '12347',
      fullName: 'Rizky Pratama',
      className: 'XII-C',
      gender: 'MALE',
      phone: '081234567892',
      position: 'MEMBER',
      photoUrl: '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Let's add some mock activities (some completed, some upcoming)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const activity1: Activity = {
      id: 'act-1',
      title: 'Latihan Dasar Kepemimpinan PMR',
      description: 'Latihan dasar kepemimpinan dan manajemen organisasi PMR.',
      date: yesterday,
      startTime: '14:00',
      endTime: '16:00',
      status: 'COMPLETED',
      createdBy: 'usr-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const activity2: Activity = {
      id: 'act-2',
      title: 'Simulasi Pertolongan Pertama Bencana',
      description: 'Praktek simulasi evakuasi dan pertolongan pertama pada kecelakaan.',
      date: today,
      startTime: '15:30',
      endTime: '17:00',
      status: 'ONGOING',
      createdBy: 'usr-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const activity3: Activity = {
      id: 'act-3',
      title: 'Materi Sanitasi dan Kesehatan Remaja',
      description: 'Pemberian materi kebersihan diri, sanitasi lingkungan, dan pola hidup sehat.',
      date: tomorrow,
      startTime: '15:30',
      endTime: '17:00',
      status: 'UPCOMING',
      createdBy: 'usr-admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add attendance record for the completed activity
    const attendance1: Attendance = {
      id: 'att-1',
      memberId: 'mem-1',
      activityId: 'act-1',
      status: 'PRESENT',
      checkIn: new Date(new Date(yesterday).setHours(14, 5)).toISOString(),
      note: 'Hadir tepat waktu',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const attendance2: Attendance = {
      id: 'att-2',
      memberId: 'mem-2',
      activityId: 'act-1',
      status: 'PERMISSION',
      checkIn: null,
      note: 'Izin mengikuti lomba sekolah',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const attendance3: Attendance = {
      id: 'att-3',
      memberId: 'mem-3',
      activityId: 'act-1',
      status: 'SICK',
      checkIn: null,
      note: 'Sakit demam',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data = {
      users: [adminUser, supervisorUser, memberUser1, memberUser2, memberUser3],
      members: [member1, member2, member3],
      activities: [activity1, activity2, activity3],
      attendances: [attendance1, attendance2, attendance3],
    };

    this.save();
    console.log('Database seeded successfully!');
  }

  // --- USER OPERATIONS ---
  public getUsers(): User[] {
    this.init();
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    this.init();
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    this.init();
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    this.init();
    if (this.getUserByEmail(user.email)) {
      throw new Error('Email sudah terdaftar.');
    }
    const newUser: User = {
      ...user,
      id: `usr-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>): User {
    this.init();
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Pengguna tidak ditemukan.');
    
    const updatedUser: User = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.users[index] = updatedUser;
    
    // Sync Member name if user updates name
    if (updates.name) {
      const memberIndex = this.data.members.findIndex(m => m.userId === id);
      if (memberIndex !== -1) {
        this.data.members[memberIndex].fullName = updates.name;
        this.data.members[memberIndex].updatedAt = new Date().toISOString();
      }
    }

    this.save();
    return updatedUser;
  }

  // --- MEMBER OPERATIONS ---
  public getMembers(): Member[] {
    this.init();
    return this.data.members;
  }

  public getMemberById(id: string): Member | undefined {
    this.init();
    return this.data.members.find(m => m.id === id);
  }

  public getMemberByUserId(userId: string): Member | undefined {
    this.init();
    return this.data.members.find(m => m.userId === userId);
  }

  public createMember(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Member {
    this.init();
    // Validate unique NIS when one is provided.
    if (member.nis && this.data.members.some(m => m.nis === member.nis)) {
      throw new Error(`NIS ${member.nis} sudah digunakan.`);
    }
    // Validate unique userId
    if (this.data.members.some(m => m.userId === member.userId)) {
      throw new Error('User ini sudah terhubung dengan Anggota lain.');
    }

    const newMember: Member = {
      ...member,
      id: `mem-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.members.push(newMember);
    this.save();
    return newMember;
  }

  public updateMember(id: string, updates: Partial<Omit<Member, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Member {
    this.init();
    const index = this.data.members.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Anggota tidak ditemukan.');

    if (updates.nis && updates.nis !== this.data.members[index].nis) {
      if (this.data.members.some(m => m.nis === updates.nis)) {
        throw new Error(`NIS ${updates.nis} sudah digunakan.`);
      }
    }

    const updatedMember: Member = {
      ...this.data.members[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.members[index] = updatedMember;

    // Sync User name if full name changes
    if (updates.fullName) {
      const userIndex = this.data.users.findIndex(u => u.id === updatedMember.userId);
      if (userIndex !== -1) {
        this.data.users[userIndex].name = updates.fullName;
        this.data.users[userIndex].updatedAt = new Date().toISOString();
      }
    }

    // Sync status back to user account
    if (updates.status) {
      const userIndex = this.data.users.findIndex(u => u.id === updatedMember.userId);
      if (userIndex !== -1) {
        this.data.users[userIndex].status = updates.status;
        this.data.users[userIndex].updatedAt = new Date().toISOString();
      }
    }

    this.save();
    return updatedMember;
  }

  // --- ACTIVITY OPERATIONS ---
  public getActivities(): Activity[] {
    this.init();
    return this.data.activities;
  }

  public getActivityById(id: string): Activity | undefined {
    this.init();
    return this.data.activities.find(a => a.id === id);
  }

  public createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Activity {
    this.init();
    
    // End time check
    if (activity.endTime < activity.startTime) {
      throw new Error('Jam Selesai tidak boleh lebih cepat dari Jam Mulai.');
    }

    const newActivity: Activity = {
      ...activity,
      id: `act-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.activities.push(newActivity);
    this.save();
    return newActivity;
  }

  public updateActivity(id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>): Activity {
    this.init();
    const index = this.data.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Kegiatan tidak ditemukan.');

    const merged = { ...this.data.activities[index], ...updates };
    if (merged.endTime < merged.startTime) {
      throw new Error('Jam Selesai tidak boleh lebih cepat dari Jam Mulai.');
    }

    const updatedActivity: Activity = {
      ...this.data.activities[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.activities[index] = updatedActivity;
    this.save();
    return updatedActivity;
  }

  public deleteActivity(id: string): void {
    this.init();
    const index = this.data.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Kegiatan tidak ditemukan.');
    
    // Delete corresponding attendances as well to keep DB clean
    this.data.attendances = this.data.attendances.filter(att => att.activityId !== id);
    this.data.activities.splice(index, 1);
    this.save();
  }

  // --- ATTENDANCE OPERATIONS ---
  public getAttendances(): Attendance[] {
    this.init();
    return this.data.attendances;
  }

  public getAttendanceById(id: string): Attendance | undefined {
    this.init();
    return this.data.attendances.find(att => att.id === id);
  }

  public getAttendanceByMemberAndActivity(memberId: string, activityId: string): Attendance | undefined {
    this.init();
    return this.data.attendances.find(att => att.memberId === memberId && att.activityId === activityId);
  }

  public createAttendance(attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Attendance {
    this.init();
    
    // Enforce Rule 01: UNIQUE(memberId, activityId)
    const existing = this.getAttendanceByMemberAndActivity(attendance.memberId, attendance.activityId);
    if (existing) {
      throw new Error('Anda sudah melakukan absensi untuk kegiatan ini.');
    }

    // Verify member is active
    const member = this.getMemberById(attendance.memberId);
    if (!member || member.status !== 'ACTIVE') {
      throw new Error('Anggota tidak aktif tidak dapat melakukan absensi.');
    }

    const newAttendance: Attendance = {
      ...attendance,
      id: `att-${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.attendances.push(newAttendance);
    this.save();
    return newAttendance;
  }

  public updateAttendance(id: string, updates: Partial<Omit<Attendance, 'id' | 'memberId' | 'activityId' | 'createdAt' | 'updatedAt'>>): Attendance {
    this.init();
    const index = this.data.attendances.findIndex(att => att.id === id);
    if (index === -1) throw new Error('Data absensi tidak ditemukan.');

    const updatedAttendance: Attendance = {
      ...this.data.attendances[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.attendances[index] = updatedAttendance;
    this.save();
    return updatedAttendance;
  }

  public deleteAttendance(id: string): void {
    this.init();
    const index = this.data.attendances.findIndex(att => att.id === id);
    if (index === -1) throw new Error('Data absensi tidak ditemukan.');
    this.data.attendances.splice(index, 1);
    this.save();
  }
}

export const db = new Database();
