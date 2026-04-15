"use client";

import GlassWrapper from '@/components/molecules/GlassWrapper';
import { useAppDispatch } from '@/hooks/hook';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { MissingGame } from '@/types/missingAccounts';
import { Button, CircularProgress, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { useCreateAccountForMissingGameMutation, useGetMissingAccountsQuery, useGetUserGameCredentialsQuery } from '../../../../../services/userApi';
import CredentialsCard from './CredentialsCard';

// ---------------------------------------------------------------------------
// Shimmer skeleton for credential cards while loading
// ---------------------------------------------------------------------------
function CredentialsCardShimmer() {
    return (
        <GlassWrapper className="p-4 lg:p-6 animate-pulse">
            <>
                <div className="credentials__header flex gap-2 items-center">
                    <div className="w-[74px] h-[74px] rounded-full bg-gray-700/50"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700/50 w-3/4 rounded"></div>
                        <div className="h-3 bg-gray-700/40 w-1/2 rounded"></div>
                        <div className="h-3 bg-gray-700/30 w-1/3 rounded"></div>
                    </div>
                </div>
                <ul className="mt-4 space-y-2">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="py-2 border-t border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2 items-center">
                            <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-700/30 rounded w-2/4 justify-self-end"></div>
                        </li>
                    ))}
                </ul>
                <div className="action__group mt-4 flex flex-col md:flex-row justify-between gap-2 md:gap-4">
                    <div className="h-10 bg-gray-700/40 rounded w-full md:w-1/2"></div>
                    <div className="h-10 bg-gray-700/30 rounded w-full md:w-1/2"></div>
                </div>
            </>
        </GlassWrapper>
    );
}

function AddGameModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetMissingAccountsQuery();
    const [createAccount, { isLoading: creating }] = useCreateAccountForMissingGameMutation();

    const games: MissingGame[] = data?.data || [];
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (slug: string) => {
        setSelected((prev) =>
            prev.includes(slug)
                ? prev.filter((s) => s !== slug)
                : prev.length < 2
                    ? [...prev, slug]
                    : prev
        );
    };

    const handleClose = () => {
        setSelected([]);
        onClose();
    };

    const handleCreate = async () => {
        let successCount = 0;
        let errorCount = 0;

        for (const slug of selected) {
            try {
                await createAccount({ game_slug: slug }).unwrap();
                successCount++;
            } catch {
                errorCount++;
            }
        }

        if (successCount > 0) {
            dispatch(showToast({
                variant: ToastVariant.SUCCESS,
                message: `${successCount} game account${successCount > 1 ? "s" : ""} created successfully.`,
            }));
        }
        if (errorCount > 0) {
            dispatch(showToast({
                variant: ToastVariant.ERROR,
                message: `${errorCount} game account${errorCount > 1 ? "s" : ""} failed to create.`,
            }));
        }

        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={creating ? undefined : handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    padding: 0,
                    overflow: "hidden",
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <div className="p-6">
                    {/* Header */}
                    <h2 className="text-[22px] font-bold text-[#0E0E11] mb-1">Add New Game</h2>
                    <p className="text-[13px] text-[#8A8A9E] mb-5">
                        Select either one or select up to two items
                    </p>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <CircularProgress size={36} />
                        </div>
                    )}

                    {/* Empty state — no missing games */}
                    {!isLoading && games.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                            <div className="w-[72px] h-[72px] rounded-full bg-gray-100 flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-[15px] font-[600] text-[#0E0E11]">You're all set!</p>
                            <p className="text-[13px] text-[#8A8A9E] max-w-[240px]">
                                You already have accounts for all available games.
                            </p>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{ mt: 1, borderRadius: "8px", textTransform: "none", borderColor: "#E0E0E3", color: "#0E0E11" }}
                            >
                                Close
                            </Button>
                        </div>
                    )}

                    {/* Game grid */}
                    {!isLoading && games.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-[360px] overflow-y-auto pr-1">
                                {games.map((game) => {
                                    const isSelected = selected.includes(game.value);
                                    return (
                                        <button
                                            key={game.id}
                                            onClick={() => toggle(game.value)}
                                            className={`relative flex items-center gap-3 p-3 rounded-[12px] border-2 transition-all text-left w-full ${isSelected
                                                ? "border-[#c026d3] bg-[#fdf4ff]"
                                                : "border-[#E0E0E3] bg-[#F8F8FB] hover:border-[#c026d3]/40"
                                                }`}
                                        >
                                            {/* Logo */}
                                            <div className="relative w-[52px] h-[52px] rounded-[10px] overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={game.logo || "/assets/images/fallback.png"}
                                                    alt={game.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Name */}
                                            <span className="text-[13px] font-[600] text-[#0E0E11] leading-tight flex-1">
                                                {game.name}
                                            </span>

                                            {/* Checkbox — top-right corner */}
                                            <span
                                                className={`absolute top-2 right-2 w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? "bg-[#c026d3] border-[#c026d3]"
                                                    : "bg-white border-[#D0D0D8]"
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleClose}
                                    disabled={creating}
                                    sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        borderColor: "#c026d3",
                                        color: "#c026d3",
                                        "&:hover": { borderColor: "#a21caf", color: "#a21caf" },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={selected.length === 0 || creating}
                                    onClick={handleCreate}
                                    sx={{
                                        borderRadius: "50px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        background: "linear-gradient(135deg, #c026d3 0%, #7c3aed 100%)",
                                        boxShadow: "none",
                                        "&:hover": { background: "linear-gradient(135deg, #a21caf 0%, #6d28d9 100%)", boxShadow: "none" },
                                        "&.Mui-disabled": { background: "#E0E0E3", color: "#fff" },
                                    }}
                                >
                                    {creating ? (
                                        <span className="flex items-center gap-2">
                                            <CircularProgress size={16} sx={{ color: "#fff" }} />
                                            Creating...
                                        </span>
                                    ) : (
                                        `Create this Game${selected.length > 0 ? ` (${selected.length})` : ""}`
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function GameCredentialsPage() {
    const { data: creds, isLoading: loadingCreds } = useGetUserGameCredentialsQuery();
    const [addGameOpen, setAddGameOpen] = useState(false);

    return (
        <section className="credentials__listing">
            <div className="section__title mb-8 lg:max-w-[521px]">
                <h1 className='mb-2 text-[24px] lg:text-[32px]'>Game Credentials</h1>
                <p className='text-[11px] lg:text-[14px]'>
                    To start playing and cashing out your winnings, you'll need a crypto wallet to purchase E-Credits and receive payouts. Don't worry—it's quick and easy!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-2 lg:gap-4">
                {loadingCreds
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <CredentialsCardShimmer key={i} />
                    ))
                    : creds?.data?.map((cred) => (
                        <div className="col-span-1" key={cred.full_name}>
                            <CredentialsCard cred={cred} />
                        </div>
                    ))}

                {/* Add New Game card — shown after credentials load */}
                {!loadingCreds && (
                    <div className="col-span-1">
                        <button
                            onClick={() => setAddGameOpen(true)}
                            className="w-full h-full min-h-[200px] glass flex flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-dashed border-white/30 hover:border-white/60 transition-all cursor-pointer group"
                        >
                            <div className="w-[52px] h-[52px] rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all">
                                <span className="text-white text-[28px] leading-none select-none">+</span>
                            </div>
                            <span className="text-white text-[14px] font-[500]">Register New Game</span>
                        </button>
                    </div>
                )}
            </div>

            <AddGameModal open={addGameOpen} onClose={() => setAddGameOpen(false)} />
        </section>
    );
}
