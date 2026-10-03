import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  EmployeeRecord,
  RecoveryRecord,
  AttendanceRecord,
} from './types';
import {
  getStoredUsers,
  saveStoredUsers,
  getCurrentUser,
  setCurrentUser,
  getStoredEmployees,
  saveStoredEmployees,
  getStoredRecoveries,
  saveStoredRecoveries,
  getStoredAttendance,
  saveStoredAttendance,
  getStoredDesignations,
  saveStoredDesignations,
  getStoredQualifications,
  saveStoredQualifications,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { FormAEmployeeRegister } from './components/FormAEmployeeRegister';
import { FormCRecoveryRegister } from './components/FormCRecoveryRegister';
import { FormDAttendanceRegister } from './components/FormDAttendanceRegister';
import { UserManagement } from './components/UserManagement';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { EmployeeIndividualDossier } from './components/EmployeeIndividualDossier';

export default function App() {
  // Authentication & Session
  const [users, setUsers] = useState<UserAccount[]>(getStoredUsers);
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(getCurrentUser);

  // Registers Data
  const [employees, setEmployees] = useState<EmployeeRecord[]>(getStoredEmployees);
  const [recoveries, setRecoveries] = useState<RecoveryRecord[]>(getStoredRecoveries);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(getStoredAttendance);
  const [designations, setDesignations] = useState<string[]>(getStoredDesignations);
  const [qualifications, setQualifications] = useState<string[]>(getStoredQualifications);

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'formA' | 'formC' | 'formD' | 'users'>('formA');

  // Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [dossierEmployee, setDossierEmployee] = useState<EmployeeRecord | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredEmployees(employees);
  }, [employees]);

  useEffect(() => {
    saveStoredRecoveries(recoveries);
  }, [recoveries]);

  useEffect(() => {
    saveStoredAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    saveStoredDesignations(designations);
  }, [designations]);

  useEffect(() => {
    saveStoredQualifications(qualifications);
  }, [qualifications]);

  // Handle Login & Session
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setActiveTab('formA');
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentUser(null);
  };

  // Staff security enforcement
  useEffect(() => {
    if (currentUser?.role === 'Staff' && activeTab !== 'formA') {
      setActiveTab('formA');
    }
  }, [currentUser, activeTab]);

  // Form A Actions
  const handleSaveEmployee = (empRecord: EmployeeRecord) => {
    setEmployees((prev) => {
      const existsIndex = prev.findIndex((e) => e.id === empRecord.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = empRecord;
        return updated;
      } else {
        return [empRecord, ...prev];
      }
    });
  };

  const handleDeleteEmployees = (ids: string[]) => {
    setEmployees((prev) => prev.filter((e) => !ids.includes(e.id)));
  };

  const handleAddDesignation = (newDesig: string) => {
    if (!designations.includes(newDesig)) {
      setDesignations((prev) => [...prev, newDesig]);
    }
  };

  const handleAddQualification = (newQual: string) => {
    if (!qualifications.includes(newQual)) {
      setQualifications((prev) => [...prev, newQual]);
    }
  };

  // Form C Actions
  const handleAddRecovery = (recRecord: RecoveryRecord) => {
    setRecoveries((prev) => [recRecord, ...prev]);
  };

  const handleUpdateRecovery = (updatedRec: RecoveryRecord) => {
    setRecoveries((prev) =>
      prev.map((r) => (r.id === updatedRec.id ? updatedRec : r))
    );
  };

  const handleDeleteRecoveries = (ids: string[]) => {
    setRecoveries((prev) => prev.filter((r) => !ids.includes(r.id)));
  };

  // Form D Actions
  const handleAddAttendance = (attRecord: AttendanceRecord) => {
    setAttendance((prev) => [...prev, attRecord]);
  };

  const handleUpdateAttendance = (newAttendance: AttendanceRecord[]) => {
    setAttendance(newAttendance);
  };

  const handleDeleteAttendance = (ids: string[]) => {
    setAttendance((prev) => prev.filter((a) => !ids.includes(a.id)));
  };

  // User Management Actions
  const handleCreateUser = (newUser: UserAccount) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSetPassword = (userId: string, newPass: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPass } : u))
    );
    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, password: newPass };
      setCurrentUserState(updated);
      setCurrentUser(updated);
    }
  };

  // If not logged in, show Login Page
  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onSetPassword={handleSetPassword}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSetPassword={handleSetPassword}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 print:p-0 print:max-w-none">
        {activeTab === 'formA' && (
          <FormAEmployeeRegister
            employees={employees}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployees={handleDeleteEmployees}
            onPrintIndividual={(emp) => setDossierEmployee(emp)}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'formC' && currentUser.role !== 'Staff' && (
          <FormCRecoveryRegister
            recoveries={recoveries}
            employees={employees}
            onAddRecovery={handleAddRecovery}
            onUpdateRecovery={handleUpdateRecovery}
            onDeleteRecoveries={handleDeleteRecoveries}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'formD' && currentUser.role !== 'Staff' && (
          <FormDAttendanceRegister
            attendanceList={attendance}
            employees={employees}
            onAddAttendance={handleAddAttendance}
            onUpdateAttendance={handleUpdateAttendance}
            onDeleteAttendance={handleDeleteAttendance}
            userRole={currentUser.role}
          />
        )}

        {activeTab === 'users' && currentUser.role === 'Admin' && (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onSetPassword={handleSetPassword}
          />
        )}
      </main>

      {/* Add / Edit Employee Modal */}
      {isEmployeeModalOpen && (
        <EmployeeFormModal
          isOpen={isEmployeeModalOpen}
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSaveEmployee}
          initialData={editingEmployee}
          designations={designations}
          qualifications={qualifications}
          onAddDesignation={handleAddDesignation}
          onAddQualification={handleAddQualification}
          userRole={currentUser.role}
          nextSrNo={employees.length + 1}
        />
      )}

      {/* Individual Employee Dossier & Service Card Print Modal */}
      {dossierEmployee && (
        <EmployeeIndividualDossier
          employee={dossierEmployee}
          onClose={() => setDossierEmployee(null)}
        />
      )}
    </div>
  );
}
