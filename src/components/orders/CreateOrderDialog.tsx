import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { CustomerOrder, PRODUCTS, USERS, COUNTRIES, OrderStatus } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateOrderDialogProps {
  order?: CustomerOrder | null;
  open?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

type FormData = Omit<CustomerOrder, 'id' | 'createdAt' | 'totalAmount'>;

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  product: PRODUCTS[0],
  quantity: 1,
  unitPrice: 0,
  status: 'Pending',
  createdBy: USERS[0],
};

export const CreateOrderDialog = ({ order, open: controlledOpen, onClose, trigger }: CreateOrderDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (value: boolean) => { if (!value) onClose?.(); } : setInternalOpen;
  
  const [formData, setFormData] = useState<FormData>(order ? {
    ...order,
    status: order.status as OrderStatus,
    country: order.country as typeof COUNTRIES[number],
  } : initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const { addOrder, updateOrder } = useDashboardStore();
  const { toast } = useToast();

  const isEditing = !!order;

  // Sync form data when order changes (for edit mode)
  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        status: order.status as OrderStatus,
        country: order.country as typeof COUNTRIES[number],
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [order]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Please fill the field';
    if (!formData.lastName.trim()) newErrors.lastName = 'Please fill the field';
    if (!formData.email.trim()) newErrors.email = 'Please fill the field';
    if (!formData.phone.trim()) newErrors.phone = 'Please fill the field';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Please fill the field';
    if (!formData.city.trim()) newErrors.city = 'Please fill the field';
    if (!formData.state.trim()) newErrors.state = 'Please fill the field';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Please fill the field';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditing && order) {
      updateOrder(order.id, formData);
      toast({
        title: 'Order Updated',
        description: 'The order has been successfully updated.',
      });
    } else {
      addOrder(formData);
      toast({
        title: 'Order Created',
        description: 'The order has been successfully created.',
      });
    }

    if (!isControlled) setInternalOpen(false);
    setFormData(initialFormData);
    setErrors({});
    onClose?.();
  };

  const handleClose = () => {
    if (!isControlled) setInternalOpen(false);
    setErrors({});
    onClose?.();
  };

  const totalAmount = formData.quantity * formData.unitPrice;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isControlled) {
        if (!isOpen) onClose?.();
      } else {
        setInternalOpen(isOpen);
        if (!isOpen) handleClose();
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Order' : 'Create New Order'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Customer Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={errors.firstName ? 'border-destructive' : ''}
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={errors.lastName ? 'border-destructive' : ''}
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className={errors.streetAddress ? 'border-destructive' : ''}
                />
                {errors.streetAddress && <p className="text-xs text-destructive">{errors.streetAddress}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State / Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={errors.state ? 'border-destructive' : ''}
                />
                {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className={errors.postalCode ? 'border-destructive' : ''}
                />
                {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode}</p>}
              </div>

              <div className="space-y-2">
                <Label>Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value: typeof COUNTRIES[number]) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Order Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product *</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map((product) => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
                  className={errors.quantity ? 'border-destructive' : ''}
                />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price ($) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  className={errors.unitPrice ? 'border-destructive' : ''}
                />
                {errors.unitPrice && <p className="text-xs text-destructive">{errors.unitPrice}</p>}
              </div>

              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input
                  value={`$${totalAmount.toFixed(2)}`}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Created By *</Label>
                <Select
                  value={formData.createdBy}
                  onValueChange={(value) => setFormData({ ...formData, createdBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update Order' : 'Create Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
